import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BillingListRecord } from '../../../models/doctor-billing';
import { DoctorBillingService } from '../../../services/doctor-billing/doctor-billing.service';
import { ConfirmDialogComponent } from '../../packages/confirm-dialog/confirm-dialog.component';
import { BillingDetailDialogComponent } from '../billing-detail-dialog/billing-detail-dialog.component';
import { Clinic } from 'src/app/shared/models/rooms.models';

interface DoctorOption { doctorId: number; doctorName: string; }

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.css']
})
export class BillListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  pageIndex = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  get pages(): number[] {
    const arr: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) arr.push(i);
    return arr;
  }

  records: BillingListRecord[] = [];

  doctorId?: number;
  clinicBranchId?: number;
  status?: 'PENDING' | 'PAID' | 'CANCELLED';
  from?: string;
  to?: string;

  clinicOptions: Clinic[] = [];
  clinicSearch = '';
  doctorOptions: DoctorOption[] = [];
  doctorSearch = '';

  loading = false;
  accessDenied = false;

  constructor(
    private billingService: DoctorBillingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.billingService.getClinics().subscribe(data => this.clinicOptions = data || []);
    this.billingService.getDoctors().subscribe(data => this.doctorOptions = (data || []).slice().sort((a, b) => a.doctorName.localeCompare(b.doctorName)));
    this.load();
  }

  get filteredClinics(): Clinic[] {
    const q = this.clinicSearch.trim().toLowerCase();
    return this.clinicOptions.filter(c => !q || (c.clinicName || '').toLowerCase().includes(q));
  }

  get filteredDoctors(): DoctorOption[] {
    const q = this.doctorSearch.trim().toLowerCase();
    return this.doctorOptions.filter(d => !q || d.doctorName.toLowerCase().includes(q));
  }

  onDoctorSelected(name: string): void {
    const match = this.doctorOptions.find(d => d.doctorName === name);
    this.doctorId = match ? match.doctorId : undefined;
    this.doctorSearch = match ? match.doctorName : name;
  }

  clearDoctor(): void {
    this.doctorId = undefined;
    this.doctorSearch = '';
  }

  onClinicSelected(name: string): void {
    const match = this.clinicOptions.find(c => c.clinicName === name);
    this.clinicBranchId = match ? match.clinicId : undefined;
    this.clinicSearch = match ? match.clinicName : name;
  }

  clearClinic(): void {
    this.clinicBranchId = undefined;
    this.clinicSearch = '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.loading = true;
    this.accessDenied = false;
    this.billingService.billingList({
      page: this.pageIndex - 1,
      size: this.pageSize,
      doctorId: this.doctorId,
      clinicBranchId: this.clinicBranchId,
      status: this.status,
      from: this.from,
      to: this.to
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.records = res.data;
        this.totalItems = res.totalItems;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err?.status === 403) {
          this.accessDenied = true;
        } else {
          this.showError('Failed to load billing records');
        }
      }
    });
  }

  applyFilters(): void {
    this.pageIndex = 1;
    this.load();
  }

  resetFilters(): void {
    this.doctorId = undefined;
    this.clinicBranchId = undefined;
    this.status = undefined;
    this.from = undefined;
    this.to = undefined;
    this.doctorSearch = '';
    this.clinicSearch = '';
    this.pageIndex = 1;
    this.load();
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.load();
  }

  viewDetail(record: BillingListRecord): void {
    this.dialog.open(BillingDetailDialogComponent, { data: record, width: '640px' });
  }

  confirmCancel(record: BillingListRecord): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Cancel Billing Record',
        message: `Cancel this billing record for ${record.doctorName} — ${record.billingDate}?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cancelRecord(record);
    });
  }

  private cancelRecord(record: BillingListRecord): void {
    this.billingService.cancelBilling(record.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (updated) => {
        this.showSuccess('Billing record cancelled');
        const idx = this.records.findIndex(r => r.id === updated.id);
        if (idx >= 0) this.records[idx] = updated;
      },
      error: (err) => {
        if (err?.status === 403) {
          this.showError('Access denied');
        } else {
          this.showError(err?.error?.message || 'Failed to cancel billing record');
        }
      }
    });
  }

  canCancel(record: BillingListRecord): boolean {
    return record.paymentStatus === 'PENDING';
  }

  private showSuccess(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
  }
  private showError(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
  }
}
