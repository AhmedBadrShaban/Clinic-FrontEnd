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
import { Subject, takeUntil, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
 

import { Clinic } from 'src/app/shared/models/rooms.models';
import { ReceptionistIdAndName, ReportsService } from '../../../services/reports.service';
import { PatientSearchResult } from '../debit-movements/debit-movements.component';
import { WhatsAppMessageType, WhatsAppMessageStatus, WhatsAppMessagesFilter, WhatsAppMessage, WhatsAppMessagesService } from '../../../services/whatsapp-messages.service';

export const MESSAGE_TYPE_LABELS: Record<WhatsAppMessageType, string> = {
  RESERVE_PACKAGE: 'Package Receipt',
  DEBIT_UPDATE: 'Debit Update',
  CHECKOUT: 'Checkout Receipt',
};

export const MESSAGE_STATUS_LABELS: Record<WhatsAppMessageStatus, string> = {
  PENDING: 'Pending',
  SUCCESS: 'Sent',
  FAILED: 'Failed',
  RETRYING: 'Retrying',
  ABANDONED: 'Abandoned',
};

const SORT_KEY_MAP: Record<string, string> = {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  sentAt: 'sentAt',
  nextRetryAt: 'nextRetryAt',
  retryCount: 'retryCount',
  status: 'status',
  messageType: 'messageType',
  patientName: 'patientName',
  patientPhone: 'patientName',
  clinicName: 'clinicName',
  createdByName: 'createdByName',
};

@Component({
  selector: 'app-whatsapp-messages',
  templateUrl: './whatsapp-messages.component.html',
  styleUrls: ['./whatsapp-messages.component.css']
})
export class WhatsAppMessagesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private patientSearch$ = new Subject<string>();

  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<any>;
  @ViewChild('typeTpl', { static: true }) typeTpl!: TemplateRef<any>;
  @ViewChild('dateTpl', { static: true }) dateTpl!: TemplateRef<any>;
  @ViewChild('retryCountTpl', { static: true }) retryCountTpl!: TemplateRef<any>;
  @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;
  @ViewChild('failureTpl', { static: true }) failureTpl!: TemplateRef<any>;
  @ViewChild('pdfTpl', { static: true }) pdfTpl!: TemplateRef<any>;

  /* ── collapse state ── */
  filtersCollapsed = false;

  /* ── filters ── */
  filters: WhatsAppMessagesFilter = { sortBy: 'createdAt', sortDir: 'desc' };
  fromDateInput = '';
  toDateInput = '';

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

  /* ── dropdown options ── */
  readonly messageTypes = [
    { value: '', label: 'All Types' },
    { value: 'RESERVE_PACKAGE', label: 'Package Receipt' },
    { value: 'DEBIT_UPDATE', label: 'Debit Update' },
    { value: 'CHECKOUT', label: 'Checkout Receipt' },
  ];

  readonly statuses = [
    { value: '', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'SUCCESS', label: 'Sent' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'RETRYING', label: 'Retrying' },
    { value: 'ABANDONED', label: 'Abandoned' },
  ];

  readonly messageTypeLabels = MESSAGE_TYPE_LABELS;
  readonly statusLabels = MESSAGE_STATUS_LABELS;

  /* ── stats summary cards ── */
  statsLoading = false;
  totalSent = 0;
  totalFailed = 0;
  totalRetrying = 0;

  /* ── retry state ── */
  retryingRowId: number | null = null;

  /* ── table ── */
  tableColumns: Array<{ key: string; label: string; template?: any }> = [];
  dataSource = new MatTableDataSource<WhatsAppMessage>();
  totalItems = 0;
  pageSize = 20;
  currentPage = 0;
  isLoading = false;

  constructor(
    private waService: WhatsAppMessagesService,
    private reportsService: ReportsService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.tableColumns = [
      { key: 'createdAt', label: 'Date', template: this.dateTpl },
      { key: 'patientName', label: 'Patient' },
      { key: 'patientPhone', label: 'Phone' },
      { key: 'clinicName', label: 'Clinic' },
      { key: 'createdByName', label: 'Receptionist' },
      { key: 'messageType', label: 'Type', template: this.typeTpl },
      { key: 'status', label: 'Status', template: this.statusTpl },
      { key: 'retryCount', label: 'Retries', template: this.retryCountTpl },
      { key: 'failureReason', label: 'Failure', template: this.failureTpl },
      { key: 'pdfUrl', label: 'Receipt', template: this.pdfTpl },
      { key: '_actions', label: '', template: this.actionsTpl },
    ];

    this.loadClinics();
    this.loadReceptionists();
    this.setupPatientSearch();
    this.loadMessages();
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* ── active filter count ── */
  get activeFilterCount(): number {
    let count = 0;
    if (this.hasPatientFilter) count++;
    if (this.hasClinicFilter) count++;
    if (this.hasReceptionistFilter) count++;
    if (this.filters.messageType) count++;
    if (this.filters.status) count++;
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
    this.loadMessages(true);
  }

  clearPatientFilter(): void {
    this.patientSearchInput = '';
    this.selectedPatientLabel = '';
    this.hasPatientFilter = false;
    this.patientResults = [];
    this.filters.patientId = undefined;
    this.loadMessages(true);
  }

  /* ── clinic helpers ── */
  private loadClinics(): void {
    this.reportsService.getAllClinicsList()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clinics) => { this.allClinics = clinics || []; this.filteredClinics = [...this.allClinics]; },
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
    this.loadMessages(true);
    this.loadStats();
  }

  clearClinicSearch(): void {
    this.clinicNameSearch = '';
    this.activeClinic = '';
    this.hasClinicFilter = false;
    this.filteredClinics = [...this.allClinics];
    this.filters.clinicId = undefined;
    this.loadMessages(true);
    this.loadStats();
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
    this.loadMessages(true);
  }

  clearReceptionistFilter(): void {
    this.receptionistSearch = '';
    this.hasReceptionistFilter = false;
    this.filteredReceptionists = [...this.allReceptionists];
    this.filters.createdBy = undefined;
    this.loadMessages(true);
  }

  /* ── date range ── */
  clearDateRange(): void {
    this.fromDateInput = '';
    this.toDateInput = '';
  }

  /* ── stats ── */
  loadStats(): void {
    this.statsLoading = true;
    const statsFilter = {
      clinicId: this.filters.clinicId ?? null,
      fromDate: this.fromDateInput ? new Date(this.fromDateInput).toISOString().slice(0, 19) : null,
      toDate: this.toDateInput ? new Date(this.toDateInput + 'T23:59:59').toISOString().slice(0, 19) : null,
    };

    this.waService.getDailyStats(statsFilter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.totalSent = stats.reduce((acc, d) => acc + d.sentCount, 0);
          this.totalFailed = stats.reduce((acc, d) => acc + d.failedCount, 0);
          this.totalRetrying = stats.reduce((acc, d) => acc + d.retryingCount, 0);
          this.statsLoading = false;
          this.cd.detectChanges();
        },
        error: () => {
          this.statsLoading = false;
          this.cd.detectChanges();
        }
      });
  }

  /* ── data ── */
  loadMessages(resetPage = false): void {
    if (resetPage) this.currentPage = 0;

    this.filters.fromDate = this.fromDateInput
      ? new Date(this.fromDateInput).toISOString().slice(0, 19)
      : null;
    this.filters.toDate = this.toDateInput
      ? new Date(this.toDateInput + 'T23:59:59').toISOString().slice(0, 19)
      : null;

    this.isLoading = true;

    this.waService
      .getMessages(this.currentPage, this.pageSize, this.filters)
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
    this.filters.sortBy = SORT_KEY_MAP[event.column] ?? 'createdAt';
    this.filters.sortDir = event.direction === 'asc' ? 'asc' : 'desc';
    this.loadMessages(true);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMessages();
  }

  clearFilters(): void {
    this.filters = { sortBy: 'createdAt', sortDir: 'desc' };
    this.fromDateInput = '';
    this.toDateInput = '';
    // clinic
    this.clinicNameSearch = '';
    this.activeClinic = '';
    this.hasClinicFilter = false;
    this.filteredClinics = [...this.allClinics];
    // receptionist
    this.receptionistSearch = '';
    this.hasReceptionistFilter = false;
    this.filteredReceptionists = [...this.allReceptionists];
    // patient
    this.patientSearchInput = '';
    this.selectedPatientLabel = '';
    this.hasPatientFilter = false;
    this.patientResults = [];
    this.loadMessages(true);
    this.loadStats();
  }

  /* ── retry ── */
  canRetry(status: WhatsAppMessageStatus): boolean {
    return status === 'FAILED' || status === 'PENDING';
  }

  onRetry(row: WhatsAppMessage): void {
    if (!this.canRetry(row.status)) return;
    this.retryingRowId = row.id;
    this.cd.detectChanges();

    this.waService.retryMessage(row.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.retryingRowId = null;
          this.loadMessages();
          this.loadStats();
        },
        error: () => {
          this.retryingRowId = null;
          this.cd.detectChanges();
        }
      });
  }

  /* ── cell helpers ── */
  statusClass(status: WhatsAppMessageStatus): string {
    const map: Record<WhatsAppMessageStatus, string> = {
      PENDING: 'status-badge status-badge--pending',
      SUCCESS: 'status-badge status-badge--success',
      FAILED: 'status-badge status-badge--failed',
      RETRYING: 'status-badge status-badge--retrying',
      ABANDONED: 'status-badge status-badge--abandoned',
    };
    return map[status] ?? 'status-badge';
  }

  typeClass(type: WhatsAppMessageType): string {
    const map: Record<WhatsAppMessageType, string> = {
      RESERVE_PACKAGE: 'type-badge type-badge--package',
      DEBIT_UPDATE: 'type-badge type-badge--debit',
      CHECKOUT: 'type-badge type-badge--checkout',
    };
    return map[type] ?? 'type-badge';
  }
}