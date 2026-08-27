import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BillResult, DoctorPreview, BillingShift } from '../../models/doctor-billing';
import { DoctorBillingService } from '../../services/doctor-billing/doctor-billing.service';
import { ConfirmDialogComponent } from '../packages/confirm-dialog/confirm-dialog.component';
import { Clinic } from 'src/app/shared/models/rooms.models';

interface MonthOption { value: number; name: string; }
interface DoctorOption { doctorId: number; doctorName: string; }

@Component({
  selector: 'app-doctor-billing',
  templateUrl: './doctor-billing.component.html',
  styleUrls: ['./doctor-billing.component.css']
})
export class DoctorBillingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  activeTab: 'day' | 'month' = 'day';

  /* day form */
  dayForm: FormGroup;
  /* month form */
  monthForm: FormGroup;

  months: MonthOption[] = [
    { value: 1, name: 'January' }, { value: 2, name: 'February' },
    { value: 3, name: 'March' }, { value: 4, name: 'April' },
    { value: 5, name: 'May' }, { value: 6, name: 'June' },
    { value: 7, name: 'July' }, { value: 8, name: 'August' },
    { value: 9, name: 'September' }, { value: 10, name: 'October' },
    { value: 11, name: 'November' }, { value: 12, name: 'December' }
  ];
  years: number[] = [];

  /* autocomplete sources (reports / reservation patterns) */
  clinicOptions: Clinic[] = [];
  clinicSearch = '';
  doctorOptions: DoctorOption[] = [];
  doctorSearch = '';

  /* results */
  preview: DoctorPreview[] = [];
  expandedDoctors = new Set<number>();
  loading = false;
  billing = false;
  billResult: BillResult | null = null;

  constructor(
    private fb: FormBuilder,
    private billingService: DoctorBillingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    const now = new Date();
    this.dayForm = this.fb.group({
      date: [this.toDateInput(now), Validators.required],
      doctorId: [null],
      clinicBranchId: [null]
    });
    this.monthForm = this.fb.group({
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

  onClinicSelected(name: string, form: FormGroup): void {
    const match = this.clinicOptions.find(c => c.clinicName === name);
    form.get('clinicBranchId')?.setValue(match ? match.clinicId : null);
    this.clinicSearch = match ? match.clinicName : name;
  }

  clearClinic(form: FormGroup): void {
    form.get('clinicBranchId')?.setValue(null);
    this.clinicSearch = '';
  }

  onDoctorSelected(name: string, form: FormGroup): void {
    const match = this.doctorOptions.find(d => d.doctorName === name);
    form.get('doctorId')?.setValue(match ? match.doctorId : null);
    this.doctorSearch = match ? match.doctorName : name;
  }

  clearDoctor(form: FormGroup): void {
    form.get('doctorId')?.setValue(null);
    this.doctorSearch = '';
  }

  selectedClinicName(form: FormGroup): string {
    const id = form.get('clinicBranchId')?.value;
    return this.clinicOptions.find(c => c.clinicId === id)?.clinicName || '';
  }

  selectedDoctorName(form: FormGroup): string {
    const id = form.get('doctorId')?.value;
    return this.doctorOptions.find(d => d.doctorId === id)?.doctorName || '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private generateYears(): void {
    const current = new Date().getFullYear();
    for (let y = current - 5; y <= current + 2; y++) this.years.push(y);
  }

  private toDateInput(d: Date): string {
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }

  switchTab(tab: 'day' | 'month'): void {
    this.activeTab = tab;
    this.preview = [];
    this.billResult = null;
    this.syncSearchFromForm(tab === 'day' ? this.dayForm : this.monthForm);
  }

  private syncSearchFromForm(form: FormGroup): void {
    this.doctorSearch = this.selectedDoctorName(form);
    this.clinicSearch = this.selectedClinicName(form);
  }

  previewDay(): void {
    if (this.dayForm.invalid) return;
    const v = this.dayForm.value;
    this.loading = true;
    this.preview = [];
    this.billResult = null;
    this.billingService.previewDay({
      date: v.date,
      doctorId: v.doctorId || undefined,
      clinicBranchId: v.clinicBranchId || undefined
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => { this.preview = data; this.loading = false; },
      error: () => { this.loading = false; this.showError('Failed to load preview'); }
    });
  }

  previewMonth(): void {
    const v = this.monthForm.value;
    if (!v.year || !v.month) return;
    this.loading = true;
    this.preview = [];
    this.billResult = null;
    this.billingService.previewMonth({
      year: v.year,
      month: v.month,
      doctorId: v.doctorId || undefined,
      clinicBranchId: v.clinicBranchId || undefined
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => { this.preview = data; this.loading = false; },
      error: () => { this.loading = false; this.showError('Failed to load preview'); }
    });
  }

  toggleExpand(doctorId: number): void {
    if (this.expandedDoctors.has(doctorId)) this.expandedDoctors.delete(doctorId);
    else this.expandedDoctors.add(doctorId);
  }

  isExpanded(doctorId: number): boolean {
    return this.expandedDoctors.has(doctorId);
  }

  confirmBill(doctor: DoctorPreview): void {
    const shiftCount = doctor.shifts.length;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Billing',
        message: `You are about to bill ${doctor.doctorName} for ${shiftCount} shift${shiftCount === 1 ? '' : 's'} totalling ${doctor.totalMoney} EGP. Confirm?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.doBill(doctor);
    });
  }

  private doBill(doctor: DoctorPreview): void {
    this.billing = true;
    const isDay = this.activeTab === 'day';
    const v = isDay ? this.dayForm.value : this.monthForm.value;
    const payload = {
      doctorId: doctor.doctorId,
      clinicBranchId: v.clinicBranchId || undefined,
      date: isDay ? v.date : undefined,
      year: isDay ? undefined : v.year,
      month: isDay ? undefined : v.month
    };
    const call = isDay
      ? this.billingService.billDay(payload)
      : this.billingService.billMonth(payload);

    call.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.billing = false;
        this.billResult = res;
        this.showSuccess('Billing completed successfully');
        // refresh preview to reflect that shifts are now paid
        if (isDay) this.previewDay(); else this.previewMonth();
      },
      error: (err) => {
        this.billing = false;
        this.showError(this.extractError(err));
      }
    });
  }

  shiftTotals(shift: BillingShift): { hourly: number; pulses: number; services: number; total: number } {
    return {
      hourly: shift.hourlyPaymentAmount,
      pulses: shift.pulsePaymentAmount,
      services: shift.servicePaymentAmount,
      total: shift.totalPaymentAmount
    };
  }

  private extractError(err: any): string {
    return err?.error?.message || 'An unexpected error occurred';
  }

  private showSuccess(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
  }
  private showError(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
  }
}
