import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

import { Clinic } from 'src/app/shared/models/rooms.models';
import { ReceptionistIdAndName, ReportsService } from '../../../services/reports.service';
import { PackageMovementsFilter, PackageMovement, PackageReportsService } from '../../../services/package-movments.service';

export const PACKAGE_MOVEMENT_TYPE_LABELS: Record<string, string> = {
  PACKAGE_RESERVED: 'Package reserved',
  CHECKOUT_SESSION_DEDUCTED: 'Checkout – session deducted',
  CHECKOUT_POINTS_DEDUCTED: 'Checkout – points deducted',
  MANUAL_SESSION_ADJUSTMENT: 'Manual session adjustment',
  MANUAL_POINTS_ADJUSTMENT: 'Manual points adjustment',
  PACKAGE_REMOVED: 'Package removed',
};

// Fields the backend accepts for sortBy (per API doc) — anything else falls back to createdAt
const SORTABLE_FIELDS = new Set([
  'createdAt', 'movementType', 'sessionsDelta', 'sessionsAfter',
  'pointsDelta', 'pointsAfter', 'packageName', 'serviceName',
  'patientName', 'patientPhone', 'clinicName', 'createdByName'
]);

// Matches GET /admin/patients/search-v2 response item shape (same as Debit Movements)
export interface PatientSearchResult {
  patientId: number;
  patientName: string;
  primaryPhone: string;
}

@Component({
  selector: 'app-package-movements',
  templateUrl: './package-movements.component.html',
  styleUrls: ['./package-movements.component.css']
})
export class PackageMovementsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private patientSearch$ = new Subject<string>();

  @ViewChild('dateTpl', { static: true }) dateTpl!: TemplateRef<any>;
  @ViewChild('serviceTpl', { static: true }) serviceTpl!: TemplateRef<any>;
  @ViewChild('deltaSessionsTpl', { static: true }) deltaSessionsTpl!: TemplateRef<any>;
  @ViewChild('deltaPointsTpl', { static: true }) deltaPointsTpl!: TemplateRef<any>;
  @ViewChild('typeTpl', { static: true }) typeTpl!: TemplateRef<any>;
  @ViewChild('doctorRoomTpl', { static: true }) doctorRoomTpl!: TemplateRef<any>;
  @ViewChild('descriptionTpl', { static: true }) descriptionTpl!: TemplateRef<any>;

  /* ── collapse state ── */
  filtersCollapsed = true;

  /* ── filters ── */
  filters: PackageMovementsFilter = { sortBy: 'createdAt', sortDir: 'desc' };
  fromDateInput = '';
  toDateInput = '';
  packageNameSearch = '';
  serviceNameSearch = '';

  /* ── clinic autocomplete ── */
  clinicNameSearch = '';
  activeClinic = '';
  hasClinicFilter = false;
  allClinics: Clinic[] = [];
  filteredClinics: Clinic[] = [];

  /* ── receptionist autocomplete ── */
  receptionistSearch = '';
  hasReceptionistFilter = false;
  receptionistSearchLoading = false;
  allReceptionists: ReceptionistIdAndName[] = [];
  filteredReceptionists: ReceptionistIdAndName[] = [];

  /* ── patient autocomplete ── */
  patientSearchInput = '';
  selectedPatientLabel = '';
  hasPatientFilter = false;
  patientResults: PatientSearchResult[] = [];
  patientSearchLoading = false;
  /** true when this page was opened pre-scoped to one patient, e.g. from the patient profile
   *  via queryParams: { patientId, patientName?, patientPhone? }, or resolved from a
   *  patientPhone query param via a phone search. */
  patientLocked = false;

  readonly movementTypes = [
    { value: '', label: 'All Types' },
    { value: 'PACKAGE_RESERVED', label: 'Package reserved' },
    { value: 'CHECKOUT_SESSION_DEDUCTED', label: 'Checkout – session deducted' },
    { value: 'CHECKOUT_POINTS_DEDUCTED', label: 'Checkout – points deducted' },
    { value: 'MANUAL_SESSION_ADJUSTMENT', label: 'Manual session adjustment' },
    { value: 'MANUAL_POINTS_ADJUSTMENT', label: 'Manual points adjustment' },
    { value: 'PACKAGE_REMOVED', label: 'Package removed' },
  ];

  readonly movementLabels = PACKAGE_MOVEMENT_TYPE_LABELS;

  /* ── table ── */
  tableColumns: Array<{ key: string; label: string; template?: any }> = [];
  dataSource = new MatTableDataSource<PackageMovement>();
  totalItems = 0;
  pageSize = 20;
  currentPage = 0;
  isLoading = false;

  constructor(
    private packageReportsService: PackageReportsService,
    private reportsService: ReportsService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.tableColumns = [
      { key: 'createdAt', label: 'Date', template: this.dateTpl },
      { key: 'patientName', label: 'Patient' },
      { key: 'patientPhone', label: 'Phone' },
      { key: 'clinicName', label: 'Clinic' },
      { key: 'packageName', label: 'Package' },
      { key: 'serviceName', label: 'Service', template: this.serviceTpl },
      { key: 'sessionsDelta', label: 'Sessions', template: this.deltaSessionsTpl },
      { key: 'pointsDelta', label: 'Points', template: this.deltaPointsTpl },
      { key: 'movementType', label: 'Type', template: this.typeTpl },
      { key: 'createdByName', label: 'Created By' },
      { key: 'doctorName', label: 'Doctor / Room', template: this.doctorRoomTpl },
      { key: 'description', label: 'Description', template: this.descriptionTpl },
    ];

    // If the incoming scope resolves asynchronously (patientPhone -> search -> patientId),
    // it triggers loadMovements() itself once resolved, so we skip the initial call here.
    const deferredInitialLoad = this.applyIncomingScope();

    this.loadClinics();
    this.loadReceptionists();
    this.setupPatientSearch();

    if (!deferredInitialLoad) {
      this.loadMovements();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* ── pre-scoping from incoming query params ──
   * Supported params:
   *   - patientId (+ optional patientName): scope directly to a known patient, no search needed.
   *   - patientPhone (no patientId): resolve to a patientId by searching patients by phone and
   *     taking the first match.
   *   - packageName: pre-fill the package name filter.
   * Returns true if this method already kicked off (and will complete) an async patient
   * resolution that itself calls loadMovements() — in that case the caller should NOT also
   * call loadMovements() immediately.
   */
  private applyIncomingScope(): boolean {
    const qp = this.route.snapshot.queryParamMap;
    const patientId = qp.get('patientId');
    const patientPhone = qp.get('patientPhone');
    const packageName = qp.get('packageName');

    if (packageName) {
      this.packageNameSearch = packageName;
      this.filtersCollapsed = false;
    }

    if (patientId) {
      const name = qp.get('patientName');
      this.filters.patientId = +patientId;
      this.hasPatientFilter = true;
      this.patientLocked = true;
      this.selectedPatientLabel = name ? name : `Patient #${patientId}`;
      this.patientSearchInput = this.selectedPatientLabel;
      return false;
    }

    if (patientPhone) {
      this.resolvePatientByPhone(patientPhone);
      return true;
    }

    return false;
  }

  /** Search patients by phone (GET /admin/patients/search-v2), take the first match, and use
   *  its patientId as the patient filter. If nothing matches, the patient filter is left
   *  cleared and movements load filtered only by the other active filters (e.g. packageName). */
  private resolvePatientByPhone(phone: string): void {
    this.patientSearchLoading = true;
    this.patientSearchInput = phone;
    this.cd.detectChanges();

    this.reportsService.searchPatientsV2(phone.trim(), 0, 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const match = res?.data?.[0];
          if (match) {
            this.filters.patientId = match.patientId;
            this.hasPatientFilter = true;
            this.patientLocked = true;
            this.selectedPatientLabel = `${match.patientName} — ${match.primaryPhone}`;
            this.patientSearchInput = this.selectedPatientLabel;
          } else {
            this.clearResolvedPatientState();
          }
          this.patientSearchLoading = false;
          this.cd.detectChanges();
          this.loadMovements(true);
        },
        error: () => {
          this.clearResolvedPatientState();
          this.patientSearchLoading = false;
          this.cd.detectChanges();
          this.loadMovements(true);
        }
      });
  }

  private clearResolvedPatientState(): void {
    this.filters.patientId = undefined;
    this.hasPatientFilter = false;
    this.patientLocked = false;
    this.selectedPatientLabel = '';
    this.patientSearchInput = '';
  }

  /* ── active filter count (for collapsed pill) ── */
  get activeFilterCount(): number {
    let count = 0;
    if (this.hasPatientFilter) count++;
    if (this.hasClinicFilter) count++;
    if (this.hasReceptionistFilter) count++;
    if (this.filters.movementType) count++;
    if (this.packageNameSearch) count++;
    if (this.serviceNameSearch) count++;
    if (this.fromDateInput || this.toDateInput) count++;
    return count;
  }

  /* ── patient search ── */
  private setupPatientSearch(): void {
    this.patientSearch$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => {
          if (!query || query.trim().length < 2) {
            this.patientResults = [];
            this.patientSearchLoading = false;
            this.cd.detectChanges();
            return of(null);
          }
          this.patientSearchLoading = true;
          this.cd.detectChanges();
          return this.reportsService.searchPatientsV2(query.trim(), 0, 15);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          if (res) this.patientResults = res.data;
          this.patientSearchLoading = false;
          this.cd.detectChanges();
        },
        error: () => {
          this.patientSearchLoading = false;
          this.cd.detectChanges();
        }
      });
  }

  onPatientSearchInput(value: string): void {
    if (this.patientLocked) return;
    this.patientSearchInput = value;
    if (!value.trim()) { this.clearPatientFilter(); return; }
    this.patientSearch$.next(value);
  }

  onPatientSelected(patient: PatientSearchResult): void {
    this.selectedPatientLabel = `${patient.patientName} — ${patient.primaryPhone}`;
    this.patientSearchInput = this.selectedPatientLabel;
    this.filters.patientId = patient.patientId;
    this.hasPatientFilter = true;
    this.patientResults = [];
    this.loadMovements(true);
  }

  clearPatientFilter(): void {
    this.patientSearchInput = '';
    this.selectedPatientLabel = '';
    this.hasPatientFilter = false;
    this.patientLocked = false;
    this.patientResults = [];
    this.filters.patientId = undefined;
    this.loadMovements(true);
  }

  patientDisplayFn(patient: PatientSearchResult): string {
    return patient ? `${patient.patientName} — ${patient.primaryPhone}` : '';
  }

  /* ── clinic helpers ── */
  private loadClinics(): void {
    this.reportsService.getAllClinicsList()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clinics) => {
          this.allClinics = clinics || [];
          this.filteredClinics = [...this.allClinics];
        },
        error: (err) => console.error('Failed to load clinics:', err)
      });
  }

  onClinicSearch(value: string): void {
    this.clinicNameSearch = value;
    if (!value.trim()) { this.clearClinicSearch(); return; }
    const q = value.toLowerCase().trim();
    this.filteredClinics = this.allClinics.filter(c => c.clinicName.toLowerCase().includes(q));
  }

  onClinicSelected(clinic: Clinic): void {
    this.clinicNameSearch = clinic.clinicName;
    this.activeClinic = clinic.clinicName;
    this.hasClinicFilter = true;
    this.filters.clinicId = clinic.clinicId;
    this.loadMovements(true);
  }

  clearClinicSearch(): void {
    this.clinicNameSearch = '';
    this.activeClinic = '';
    this.hasClinicFilter = false;
    this.filteredClinics = [...this.allClinics];
    this.filters.clinicId = undefined;
    this.loadMovements(true);
  }

  /* ── receptionist helpers ── */
  private loadReceptionists(): void {
    this.receptionistSearchLoading = true;
    this.reportsService.getReceptionistIdAndName()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (list) => {
          this.allReceptionists = list || [];
          this.filteredReceptionists = [...this.allReceptionists];
          this.receptionistSearchLoading = false;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load receptionists:', err);
          this.receptionistSearchLoading = false;
          this.cd.detectChanges();
        }
      });
  }

  onReceptionistSearch(value: string): void {
    this.receptionistSearch = value;
    if (!value.trim()) { this.clearReceptionistFilter(); return; }
    const q = value.toLowerCase().trim();
    this.filteredReceptionists = this.allReceptionists.filter(
      r => r.name.toLowerCase().includes(q) || r.receptionistId.toString().includes(q)
    );
  }

  onReceptionistSelected(receptionist: ReceptionistIdAndName): void {
    this.receptionistSearch = receptionist.name;
    this.hasReceptionistFilter = true;
    this.filters.createdBy = receptionist.receptionistId;
    this.loadMovements(true);
  }

  clearReceptionistFilter(): void {
    this.receptionistSearch = '';
    this.hasReceptionistFilter = false;
    this.filteredReceptionists = [...this.allReceptionists];
    this.filters.createdBy = undefined;
    this.loadMovements(true);
  }

  /* ── date range ── */
  clearDateRange(): void {
    this.fromDateInput = '';
    this.toDateInput = '';
  }

  /* ── data ── */
  loadMovements(resetPage = false): void {
    if (resetPage) this.currentPage = 0;

    this.filters.fromDate = this.fromDateInput
      ? new Date(this.fromDateInput).toISOString().slice(0, 19)
      : null;
    this.filters.toDate = this.toDateInput
      ? new Date(this.toDateInput + 'T23:59:59').toISOString().slice(0, 19)
      : null;
    this.filters.packageName = this.packageNameSearch.trim() || null;
    this.filters.serviceName = this.serviceNameSearch.trim() || null;

    this.isLoading = true;

    this.packageReportsService
      .getPackageMovements(this.currentPage, this.pageSize, this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.dataSource.data = [...res.data];
          this.totalItems = res.totalItems;
          this.isLoading = false;
          this.cd.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.cd.detectChanges();
        }
      });
  }

  onSortChange(event: { column: string; direction: string }): void {
    this.filters.sortBy = SORTABLE_FIELDS.has(event.column) ? event.column : 'createdAt';
    this.filters.sortDir = event.direction === 'asc' ? 'asc' : 'desc';
    this.loadMovements(true);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMovements();
  }

  clearFilters(): void {
    this.filters = { sortBy: 'createdAt', sortDir: 'desc' };
    this.fromDateInput = '';
    this.toDateInput = '';
    this.packageNameSearch = '';
    this.serviceNameSearch = '';

    // clinic
    this.clinicNameSearch = '';
    this.activeClinic = '';
    this.hasClinicFilter = false;
    this.filteredClinics = [...this.allClinics];

    // receptionist
    this.receptionistSearch = '';
    this.hasReceptionistFilter = false;
    this.filteredReceptionists = [...this.allReceptionists];

    // patient — keep the scope if it was locked in from another page
    if (!this.patientLocked) {
      this.patientSearchInput = '';
      this.selectedPatientLabel = '';
      this.hasPatientFilter = false;
      this.patientResults = [];
    }

    this.loadMovements(true);
  }

  /* ── cell helpers ── */
  deltaClass(delta: number): string {
    if (delta > 0) return 'delta--positive';
    if (delta < 0) return 'delta--negative';
    return 'delta--zero';
  }

  deltaPrefix(delta: number): string { return delta > 0 ? '+' : ''; }

  typeClass(type: string): string {
    const map: Record<string, string> = {
      PACKAGE_RESERVED: 'type-badge type-badge--reserved',
      CHECKOUT_SESSION_DEDUCTED: 'type-badge type-badge--checkout',
      CHECKOUT_POINTS_DEDUCTED: 'type-badge type-badge--checkout',
      MANUAL_SESSION_ADJUSTMENT: 'type-badge type-badge--manual',
      MANUAL_POINTS_ADJUSTMENT: 'type-badge type-badge--manual',
      PACKAGE_REMOVED: 'type-badge type-badge--removed',
    };
    return map[type] ?? 'type-badge';
  }

  doctorRoomLabel(row: PackageMovement): string {
    const parts = [row.doctorName, row.roomName].filter(Boolean);
    return parts.length ? parts.join(' · ') : '-';
  }
}