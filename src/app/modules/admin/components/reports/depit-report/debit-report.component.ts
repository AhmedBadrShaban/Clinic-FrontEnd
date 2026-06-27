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
import { Subject, takeUntil } from 'rxjs';
import { DebitReportsService } from '../../../services/debit-reports/debit-reports.service';
import { ReportsService } from '../../../services/reports/reports.service';

export interface DebitSummary {
  totalDebitIn: number;
  totalDebitPaid: number;
  remainingDebit: number;
  patientsWithDebit: number;
}

export interface DebitPatient {
  patientName: string;
  phone: string;
  totalDebitIn: number;
  totalDebitPaid: number;
  remainingDebit: number;
  clinicName: string;
}

export interface DebitReportResponse {
  summary: DebitSummary;
  clinicName: string | null;
  data: DebitPatient[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

// backend sortBy key map
const SORT_KEY_MAP: Record<string, string> = {
  patientName: 'patientName',
  phone: 'patientName',   // no backend sort for phone, fallback
  clinicName: 'clinicName',
  totalDebitIn: 'totalDebitIn',
  totalDebitPaid: 'totalDebitPaid',
  remainingDebit: 'remainingDebit',
};

@Component({
  selector: 'app-debit-report',
  templateUrl: './debit-report.component.html',
  styleUrls: ['./debit-report.component.css']
})
export class DebitReportComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('remainingTpl', { static: true }) remainingTpl!: TemplateRef<any>;
  @ViewChild('phoneTpl', { static: true }) phoneTpl!: TemplateRef<any>;

  /* ── clinic search ── */
  clinicNameFilter = '';
  activeClinic = '';
  hasClinicFilter = false;
  allClinics: string[] = [];
  filteredClinics: string[] = [];

   sortBy: string = 'patientName';
  sortDir: 'asc' | 'desc' = 'asc';

  /* ── summary ── */
  summary: DebitSummary = {
    totalDebitIn: 0,
    totalDebitPaid: 0,
    remainingDebit: 0,
    patientsWithDebit: 0
  };

  /* ── table ── */
  tableColumns: Array<{ key: string; label: string; template?: any }> = [];
  dataSource = new MatTableDataSource<DebitPatient>();
  totalItems = 0;
  pageSize = 20;
  currentPage = 0;
  isLoading = false;

  constructor(
    private debitService: DebitReportsService,
    private reportsService: ReportsService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.tableColumns = [
      { key: 'patientName', label: 'Patient Name' },
      { key: 'phone', label: 'Phone', template: this.phoneTpl },
      { key: 'clinicName', label: 'Clinic' },
      { key: 'totalDebitIn', label: 'Total Debit (EGP)' },
      { key: 'totalDebitPaid', label: 'Paid (EGP)' },
      { key: 'remainingDebit', label: 'Outstanding (EGP)', template: this.remainingTpl },
    ];

    this.loadClinics();
    this.loadReport();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* ── clinic helpers ── */
  private loadClinics(): void {
    this.reportsService.getAllClinics()
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
    this.clinicNameFilter = value;
    const q = value.toLowerCase().trim();
    this.filteredClinics = this.allClinics.filter(c => c.toLowerCase().includes(q));
  }

  onClinicSelected(clinic: string): void {
    this.clinicNameFilter = clinic;
    this.activeClinic = clinic;
    this.hasClinicFilter = true;
    this.loadReport(true);
  }

  clearFilter(): void {
    this.clinicNameFilter = '';
    this.activeClinic = '';
    this.hasClinicFilter = false;
    this.filteredClinics = [...this.allClinics];
    this.loadReport(true);
  }

  /* ── sorting ── */
  onSortChange(event: { column: string; direction: string }): void {
    this.sortBy = SORT_KEY_MAP[event.column] ?? 'patientName';
    this.sortDir = event.direction === 'asc' ? 'asc' : 'desc';
    this.loadReport(true);
  }

  /* ── data ── */
  loadReport(resetPage = false): void {
    if (resetPage) this.currentPage = 0;
    this.isLoading = true;

    this.debitService
      .getDebitReport(
        this.currentPage,
        this.pageSize,
        this.sortBy,
        this.sortDir,
        this.activeClinic,

      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.summary = res.summary;
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

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadReport();
  }
}