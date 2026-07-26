// Updated patient-info.component.ts with lazy loading support + debit history link
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PatientService } from 'src/app/modules/receptionist/services/patient-server/patient.service';
import { PatientInfo } from 'src/app/modules/receptionist/models/patient-Info';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DebitConfirmDialogComponent } from './debit-confirm-dialog/debit-confirm-dialog.component';
@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientInfoComponent implements OnInit, OnDestroy, OnChanges {
  @Input() phoneNumber: string | null = null;
  @Input() info: PatientInfo | null = null;
  @Input() isActive: boolean = false; // New input to track if tab is active

  formData: FormGroup;
  oldInfo: PatientInfo | null = null;

  isLoading = false;
  hasError = false;
  errorMessage = '';

  /** View/edit mode for the main info fields. Starts in view (read-only) mode so a patient's
   *  data can't be accidentally changed and saved — fields only become editable after the
   *  user explicitly clicks "Edit". */
  isEditMode = false;

  private hasInitialized = false;
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar

  ) {
    // Initialize empty form to prevent errors
    this.initEmptyForm();
  }

  ngOnInit(): void {
    //console.log('PatientInfoComponent initialized, waiting to become active');
    // Don't load data here - wait for component to become active
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Handle when component becomes active or data changes
    if (changes['isActive']) {
      this.handleActiveStateChange();
    }

    // Handle when info data is passed from parent (after search)
    if (changes['info'] && changes['info'].currentValue && this.isActive) {
      this.initForm(changes['info'].currentValue);
      this.hasInitialized = true;
    }

    // Handle phone number changes
    if (changes['phoneNumber'] && this.isActive) {
      this.handlePhoneNumberChange(changes['phoneNumber'].currentValue);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private handleActiveStateChange(): void {
    if (this.isActive && !this.hasInitialized) {
      //console.log('PatientInfoComponent becoming active');

      // If we already have info data from parent, use it
      if (this.info) {
        this.initForm(this.info);
        this.hasInitialized = true;
      } else if (this.phoneNumber) {
        // Otherwise, load data if we have phone number
        this.loadAdditionalPatientData();
      }

      this.cdr.markForCheck();
    }
  }

  private handlePhoneNumberChange(newPhoneNumber: string): void {
    if (newPhoneNumber !== this.oldInfo?.primaryPhone) {
      this.resetComponent();

      if (this.isActive && newPhoneNumber) {
        this.loadAdditionalPatientData();
      }
    }
  }

  private resetComponent(): void {
    this.hasInitialized = false;
    this.oldInfo = null;
    this.initEmptyForm();
    this.hasError = false;
    this.errorMessage = '';
    this.isEditMode = false;
  }

  private loadAdditionalPatientData(): void {
    if (!this.phoneNumber || this.hasInitialized) {
      return;
    }

    this.isLoading = true;
    this.hasError = false;
    this.cdr.markForCheck();

    //console.log(`Loading additional patient data for: ${this.phoneNumber}`);

    // Only call this if you need additional data beyond what's passed in 'info'
    // If 'info' contains all needed data, you can skip this API call
    const subscription = this.patientService.searchPatients(this.phoneNumber)
      .subscribe({
        next: (data: PatientInfo) => {
          this.initForm(data);
          this.hasInitialized = true;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading patient data:', error);
          this.hasError = true;
          this.errorMessage = 'Failed to load patient information';
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });

    this.subscriptions.add(subscription);
  }

  private initEmptyForm(): void {
    this.formData = this.fb.group({
      name: [''],
      gender: [''],
      primaryPhone: [''],
      secondaryPhone: [''],
      note: [''],
      date: [''],
      lastReservation: [''],
      knowUsThrough: [''],
      debit: [null]
    });
  }

  private initForm(info: PatientInfo): void {
    if (!info) return;

    this.formData = this.fb.group({
      name: [info.name || ''],
      gender: [info.gender || ''],
      primaryPhone: [info.primaryPhone || ''],
      secondaryPhone: [info.secondaryPhone || ''],
      note: [info.note || ''],
      date: [info.date || ''],
      lastReservation: [info.lastReservation || ''],
      knowUsThrough: [info.knowUsThrough || ''],
      debit: [null]
    });

    this.oldInfo = { ...info };
    this.isEditMode = false;
    //console.log('Form initialized with patient data:', this.oldInfo);
  }

  updateInfo(): void {
    if (!this.oldInfo?.primaryPhone) {
      alert('No patient selected');
      return;
    }

    const formValue = this.formData.value;
    //console.log('Updating patient info:', formValue);

    const subscription = this.patientService.updatePatient(this.oldInfo.primaryPhone, formValue)
      .subscribe({
        next: (data) => {
          alert(data.message);
          this.oldInfo = { ...formValue };
          this.isEditMode = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          alert(err.error?.message || 'Update failed');
          console.error('Update error:', err);
        }
      });

    this.subscriptions.add(subscription);
  }

  confirmDebitUpdate(): void {

    if (!this.oldInfo?.primaryPhone) {
      return;
    }

    const amount = Number(this.formData.get('debit')?.value);

    if (!amount || amount <= 0) {
      this.snackBar.open(
        'Please enter a valid debit amount.',
        'Close',
        {
          duration: 3000, horizontalPosition: 'center',  
          verticalPosition: 'top',   }
      );
      return;
    }

    if (amount > (this.oldInfo.debit ?? 0)) {
      this.snackBar.open(
        'Amount cannot exceed the current debit.',
        'Close',
        {
          duration: 3000, horizontalPosition: 'center',
          verticalPosition: 'top',
}
      );
      return;
    }

    this.dialog.open(DebitConfirmDialogComponent, {
      width: '420px',
      disableClose: true,
      data: { amount }
    })
      .afterClosed()
      .subscribe(result => {

        if (result) {
          this.updateDepit(amount);
        }

      });

  }

  updateDepit(amount: number): void {

    const subscription = this.patientService
      .updatePatientDepit(this.oldInfo!.primaryPhone, amount)
      .subscribe({

        next: (data) => {

          this.oldInfo!.debit =
            (this.oldInfo!.debit || 0) - amount;

          this.formData.patchValue({
            debit: null
          });

          this.snackBar.open(
            data.message,
            'Close',
            {
              duration: 3000, horizontalPosition: 'center',
              verticalPosition: 'top',
}
          );

          this.cdr.markForCheck();
        },

        error: (err) => {

          this.snackBar.open(
            err.error?.message || 'Failed to update debit.',
            'Close',
            {
              duration: 4000, horizontalPosition: 'center',
              verticalPosition: 'top',
}
          );

        }

      });

    this.subscriptions.add(subscription);

  }
  cancel(): void {
    if (this.oldInfo) {
      this.formData.patchValue(this.oldInfo);
      //console.log('Cancelled - form reset to:', this.oldInfo);
    }
    this.isEditMode = false;
  }

  /** Unlocks the main info fields for editing. Called from the "Edit" button in view mode. */
  enterEditMode(): void {
    if (!this.isDataReady) return;
    this.isEditMode = true;
  }

  // Helper getter for template
  get isDataReady(): boolean {
    return this.hasInitialized && !this.isLoading && !!this.oldInfo;
  }

  /** CSS class for the debit balance display — mirrors the delta coloring used on the
   *  debit-movements report (positive = owes money = danger, negative/zero = success/muted). */
  get debitBalanceClass(): string {
    const debit = this.oldInfo?.debit ?? 0;
    if (debit > 0) return 'delta--positive';
    if (debit < 0) return 'delta--negative';
    return 'delta--zero';
  }

  /** Query params for the "View debit history" link. Null (hides the link) until a patient
   *  is loaded. We already know the patientId here, so it's sent directly — the debit
   *  movements report filters by it right away, no phone lookup needed. patientName/
   *  patientPhone are sent along purely to pre-fill the report's patient search field label. */
  get debitHistoryQueryParams(): { patientId: number; patientName?: string; patientPhone?: string } | null {
    const id = this.oldInfo?.patient_id;
    if (!id) return null;

    const params: { patientId: number; patientName?: string; patientPhone?: string } = { patientId: id };
    if (this.oldInfo?.name) params.patientName = this.oldInfo.name;
    if (this.oldInfo?.primaryPhone) params.patientPhone = this.oldInfo.primaryPhone;
    return params;
  }
    get isAdmin(): boolean {
      return this.authService.userType === 'ROLE_ADMIN';
    }
}