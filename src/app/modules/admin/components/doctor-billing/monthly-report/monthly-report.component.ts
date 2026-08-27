import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DoctorMonthlyBillingReportRow } from '../../../models/doctor-billing';
import { DoctorBillingService } from '../../../services/doctor-billing/doctor-billing.service';
import { Clinic } from 'src/app/shared/models/rooms.models';

interface MonthOption { value: number; name: string; }
interface DoctorOption { doctorId: number; doctorName: string; }

@Component({
  selector: 'app-monthly-billing-report',
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.css']
})
export class MonthlyBillingReportComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  reportForm: FormGroup;
  months: MonthOption[] = [
    { value: 1, name: 'January' }, { value: 2, name: 'February' },
    { value: 3, name: 'March' }, { value: 4, name: 'April' },
    { value: 5, name: 'May' }, { value: 6, name: 'June' },
    { value: 7, name: 'July' }, { value: 8, name: 'August' },
    { value: 9, name: 'September' }, { value: 10, name: 'October' },
    { value: 11, name: 'November' }, { value: 12, name: 'December' }
  ];
  years: number[] = [];

  rows: DoctorMonthlyBillingReportRow[] = [];
  loading = false;
  searched = false;

  clinicOptions: Clinic[] = [];
  clinicSearch = '';
  doctorOptions: DoctorOption[] = [];
  doctorSearch = '';

  constructor(
    private fb: FormBuilder,
    private billingService: DoctorBillingService,
    private snackBar: MatSnackBar
  ) {
    const now = new Date();
    this.reportForm = this.fb.group({
      year: [now.getFullYear(), Validators.required],
      month: [now.getMonth() + 1, Validators.required],
      doctorId: [null],
      clinicBranchId: [null]
    });
    this.generateYears();
  }

  ngOnInit(): void {
    this.billingService.getClinics().subscribe(data => this.clinicOptions = data || []);
    this.billingService.getDoctors().subscribe(data => this.doctorOptions = (data || []).slice().sort((a, b) => a.doctorName.localeCompare(b.doctorName)));
  }

  get filteredClinics(): Clinic[] {
    const q = this.clinicSearch.trim().toLowerCase();
    return this.clinicOptions.filter(c => !q || (c.clinicName || '').toLowerCase().includes(q));
  }

  get filteredDoctors(): DoctorOption[] {
    const q = this.doctorSearch.trim().toLowerCase();
    return this.doctorOptions.filter(d => !q || d.doctorName.toLowerCase().includes(q));
  }

  onClinicSelected(name: string): void {
    const match = this.clinicOptions.find(c => c.clinicName === name);
    this.reportForm.get('clinicBranchId')?.setValue(match ? match.clinicId : null);
    this.clinicSearch = match ? match.clinicName : name;
  }

  clearClinic(): void {
    this.reportForm.get('clinicBranchId')?.setValue(null);
    this.clinicSearch = '';
  }

  onDoctorSelected(name: string): void {
    const match = this.doctorOptions.find(d => d.doctorName === name);
    this.reportForm.get('doctorId')?.setValue(match ? match.doctorId : null);
    this.doctorSearch = match ? match.doctorName : name;
  }

  clearDoctor(): void {
    this.reportForm.get('doctorId')?.setValue(null);
    this.doctorSearch = '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private generateYears(): void {
    const current = new Date().getFullYear();
    for (let y = current - 5; y <= current + 2; y++) this.years.push(y);
  }

  onGenerate(): void {
    const v = this.reportForm.getRawValue();
    if (!v.year || !v.month) return;
    this.loading = true;
    this.rows = [];
    this.billingService.monthlyReport({
      year: v.year,
      month: v.month,
      doctorId: v.doctorId || undefined,
      clinicBranchId: v.clinicBranchId || undefined
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => { this.rows = data; this.loading = false; this.searched = true; },
      error: () => { this.loading = false; this.searched = true; this.showError('Failed to load report'); }
    });
  }

  total(row: DoctorMonthlyBillingReportRow): number {
    return row.totalPaidAmount + row.remainingAmount;
  }

  hasRemaining(row: DoctorMonthlyBillingReportRow): boolean {
    return row.remainingAmount > 0;
  }

  private showError(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
  }
}
