import {
  Component,
  OnInit,
  ChangeDetectorRef,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { DebitReportsService } from '../../../services/reports/debit-reports.service';
 
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

@Component({
  selector: 'app-debit-report',
  templateUrl: './debit-report.component.html',
  styleUrls: ['./debit-report.component.css']
})
export class DebitReportComponent implements OnInit {
  @ViewChild('remainingTpl', { static: true }) remainingTpl!: TemplateRef<any>;
  @ViewChild('phoneTpl', { static: true }) phoneTpl!: TemplateRef<any>;

  /* ── filter ── */
  clinicNameFilter = '';

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
    private reportsService: DebitReportsService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.tableColumns = [
      { key: 'patientName', label: 'Patient Name' },
      { key: 'phone', label: 'Phone', template: this.phoneTpl },
      { key: 'clinicName', label: 'Clinic' },
      { key: 'totalDebitIn', label: 'Total Debit (EGP)' },
      { key: 'totalDebitPaid', label: 'Paid (EGP)' },
      { key: 'remainingDebit', label: 'Outstanding balance (EGP)', template: this.remainingTpl }
    ];

    this.loadReport();
  }

  loadReport(resetPage = false): void {
    if (resetPage) this.currentPage = 0;

    this.isLoading = true;

    this.reportsService
      .getDebitReport(this.currentPage, this.pageSize, this.clinicNameFilter)
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

  clearFilter(): void {
    this.clinicNameFilter = '';
    this.loadReport(true);
  }
}