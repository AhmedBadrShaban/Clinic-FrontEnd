import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { IPatient } from 'src/app/modules/receptionist/models/ipatient';
import { PatientService } from '../../services/patient-server/patient.service';
import { ReservationsService } from 'src/app/modules/receptionist/services/reservations-services/reservations.service';
import { AuthService } from './../../../../shared/services/auth.service';
import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgIf, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-add-new-patient',
    templateUrl: './add-new-patient.component.html',
    styleUrls: ['./add-new-patient.component.css'],
    standalone: true,
    imports: [MatCardModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, NgIf, MatSelectModule, MatOptionModule, MatDatepickerModule, NgFor, MatButtonModule, MatProgressSpinnerModule]
})
export class AddNewPatientComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  newPatientFm: FormGroup;
  displayError = false;
  displayError2 = false;
  isLoading = false;
  clinics: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialogRef: MatDialogRef<AddNewPatientComponent>,
    public newPatient: PatientService,
    private authService: AuthService,
    private updatePatients: ReservationsService,
    private roomsService:RoomsService
  ) {
    this.initializeForm();
    this.setupPhoneValidation();
  }

  ngOnInit(): void {
    // Load clinics if user is admin
    if (this.isAdmin) {
      this.loadClinics();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.newPatientFm = this.fb.group({
      name: ['', [Validators.required]],
      note: [''],
      primaryPhone: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      secondaryPhone: ['', [Validators.pattern(/^\d{11}$/)]],
      knowUsThrough: ['', [Validators.required]],
      date: [''],
      gender: ['', [Validators.required]],
      // Add clinic field for admin users
      ...(this.isAdmin && { clinicName: ['', [Validators.required]] })
    });
  }

  private setupPhoneValidation(): void {
    // Primary phone validation
    this.newPatientFm.get('primaryPhone')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.displayError = !this.validatePhoneNumber('primaryPhone');
      });

    // Secondary phone validation
    this.newPatientFm.get('secondaryPhone')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.displayError2 = !this.validatePhoneNumber('secondaryPhone');
      });
  }

  private loadClinics(): void {
    this.roomsService.allClinics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clinics: any[]) => {
          this.clinics = clinics;
        //console.log('Clinics loaded:', clinics);
        },
        error: (error: any) => {
          console.error('Error loading clinics:', error);
          // You might want to show a user-friendly error message
        }
      });
  }

  validatePhoneNumber(fieldName: string): boolean {
    const phoneControl = this.newPatientFm.get(fieldName);
    if (phoneControl && phoneControl.value) {
      const phoneNumberRegex = /^\d{11}$/;
      return phoneNumberRegex.test(phoneControl.value);
    }
    return false;
  }

  submit(): void {
    if (this.newPatientFm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    const userModel: IPatient = this.newPatientFm.value as IPatient;

    this.newPatient.addNewPatient(userModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.isLoading = false;
          this.showSuccessMessage(data.message);
          this.handleSuccessNavigation();
        },
        error: (err) => {
          this.isLoading = false;
          this.showErrorMessage(err.error?.message || 'An error occurred while adding the patient.');
          console.error('Error adding patient:', err);
        }
      });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.newPatientFm.controls).forEach(key => {
      const control = this.newPatientFm.get(key);
      control?.markAsTouched();
    });
  }

  private handleSuccessNavigation(): void {
    if (this.userType === 'ROLE_RESEPTIANIST') {
      this.router.navigateByUrl('receptionist/addpatient');
    } else if (this.userType === 'ROLE_ADMIN') {
      this.updatePatientsArray();
      this.closeDialog();
    }
  }

  private updatePatientsArray(): void {
    this.updatePatients.getPatientsNamesAndPhonesAuto(0)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.updatePatients.updatePatientsArray(data);
        },
        error: (error) => {
          console.error('Error updating patients array:', error);
        }
      });
  }

  private showSuccessMessage(message: string): void {
    // You can replace this with a more sophisticated notification system
    // like Angular Material Snackbar
    alert(message);
  }

  private showErrorMessage(message: string): void {
    // You can replace this with a more sophisticated notification system
    alert(message);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  // Getter for template
  get isAdmin(): boolean {
    return this.authService.userType === 'ROLE_ADMIN';
  }

  get userType(): string|null {
    return this.authService.userType;
  }

  // Helper method to get form control errors
  getFieldError(fieldName: string): string | null {
    const control = this.newPatientFm.get(fieldName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName} is required`;
      }
      if (control.errors['pattern']) {
        if (fieldName.includes('Phone')) {
          return 'Phone number must be 11 digits';
        }
        if (fieldName === 'name') {
          return 'Name must be at least 3 characters and contain only letters';
        }
      }
    }
    return null;
  }

  // Method to check if field has error
  hasFieldError(fieldName: string): boolean {
    const control = this.newPatientFm.get(fieldName);
    return !!(control && control.errors && control.touched);
  }
}