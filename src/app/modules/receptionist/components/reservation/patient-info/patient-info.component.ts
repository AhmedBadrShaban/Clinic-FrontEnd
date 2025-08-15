// Updated patient-info.component.ts with lazy loading support
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

  private hasInitialized = false;
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private cdr: ChangeDetectorRef
  ) {
    // Initialize empty form to prevent errors
    this.initEmptyForm();
  }

  ngOnInit(): void {
    console.log('PatientInfoComponent initialized, waiting to become active');
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
      console.log('PatientInfoComponent becoming active');

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
  }

  private loadAdditionalPatientData(): void {
    if (!this.phoneNumber || this.hasInitialized) {
      return;
    }

    this.isLoading = true;
    this.hasError = false;
    this.cdr.markForCheck();

    console.log(`Loading additional patient data for: ${this.phoneNumber}`);

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
    console.log('Form initialized with patient data:', this.oldInfo);
  }

  updateInfo(): void {
    if (!this.oldInfo?.primaryPhone) {
      alert('No patient selected');
      return;
    }

    const formValue = this.formData.value;
    console.log('Updating patient info:', formValue);

    const subscription = this.patientService.updatePatient(this.oldInfo.primaryPhone, formValue)
      .subscribe({
        next: (data) => {
          alert(data.message);
          this.oldInfo = { ...formValue };
          this.cdr.markForCheck();
        },
        error: (err) => {
          alert(err.error?.message || 'Update failed');
          console.error('Update error:', err);
        }
      });

    this.subscriptions.add(subscription);
  }

  updateDepit(): void {
    if (!this.oldInfo?.primaryPhone) {
      alert('No patient selected');
      return;
    }

    const debitControl = this.formData.get('debit')?.value;

    if (!debitControl) {
      alert('Please enter a debit amount');
      return;
    }

    if (confirm(`Are you sure you want to update debit by: ${debitControl}?`)) {
      const subscription = this.patientService.updatePatientDepit(this.oldInfo.primaryPhone, debitControl)
        .subscribe({
          next: (data) => {
            alert(data.message);
            // Instead of location.reload(), update the form data
            if (this.oldInfo) {
              this.oldInfo.debit = (this.oldInfo.debit || 0) + Number(debitControl);
              this.formData.patchValue({ debit: null }); // Reset debit input
              this.cdr.markForCheck();
            }
          },
          error: (err) => {
            alert(err.error?.message || 'Debit update failed');
            console.error('Debit update error:', err);
          }
        });

      this.subscriptions.add(subscription);
    }
  }

  cancel(): void {
    if (this.oldInfo) {
      this.formData.patchValue(this.oldInfo);
      console.log('Cancelled - form reset to:', this.oldInfo);
    }
  }

  // Helper getter for template
  get isDataReady(): boolean {
    return this.hasInitialized && !this.isLoading && !!this.oldInfo;
  }
}