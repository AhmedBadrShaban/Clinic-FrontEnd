import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil, forkJoin } from 'rxjs';

import { PatientInfo } from 'src/app/modules/receptionist/models/patient-Info';
import { PatientService } from 'src/app/modules/receptionist/services/patient-server/patient.service';
import { ReservationfmService } from 'src/app/modules/receptionist/services/Reservation_Form/reservationfm.service';
import { ReservationsService } from 'src/app/modules/receptionist/services/reservations-services/reservations.service';
import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';

@Component({
  selector: 'app-update-reservation',
  templateUrl: './update-reservation.component.html',
  styleUrls: ['./update-reservation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateReservationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  AllNames: any[] = [];
  FilterdNames: string[] = [];
  allServices: any[] = [];
  selectedServices: { [key: string]: boolean } = {};
  doctorName: any;
  formData: FormGroup;

  isLoading = false;
  isSubmitting = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateReservationComponent>,
    private fb: FormBuilder,
    private reservationService: ReservationfmService,
    private patientService: PatientService,
    private roomService: RoomsService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {
    this.formData = this.fb.group({
      patientName: [this.data.patientName],
      patientPhone: [this.data.patientPhone],
      reservationId: [this.data.reservationId],
      doctorName: [this.data.doctorName, Validators.required],
      reservationDate: [this.data.reservationDate, Validators.required],
      reservationStart: [this.data.reservationStart, Validators.required],
      reservationEnd: [this.data.reservationEnd, Validators.required],
      note: [this.data.note],
      services: [this.data.services]
    });

  //console.log('Received reservation data:', this.data);
  }

  ngOnInit(): void {
    this.doctorName = this.data.doctorName;
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    // Load doctors and services concurrently
    forkJoin({
      doctors: this.reservationService.getAllDoctorsNames(),
      services: this.reservationService.getAllServicesNamesToRoom(this.data.roomName)
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ({ doctors, services }) => {
        this.AllNames = doctors;
        this.FilterdNames = this.AllNames;
        this.allServices = services;

        // Initialize selected services
        this.allServices.forEach(service => {
          this.selectedServices[service] = this.data.services.includes(service);
        });

      //console.log('Loaded doctors:', this.AllNames.length);
      //console.log('Loaded services:', this.allServices.length);
      //console.log('Selected services:', this.selectedServices);

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading initial data:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onChange(value: string): void {
    this.FilterdNames = this.AllNames.filter(name =>
      name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  update(): void {
    if (!this.formData.valid) {
      console.error('Form is invalid');
      return;
    }

    if (this.isSubmitting) return; // Prevent double submission

    this.isSubmitting = true;
    this.cdr.detectChanges();

    const selectedServices = Object.keys(this.selectedServices)
      .filter(service => this.selectedServices[service]);

    const formValue = { ...this.formData.value };
    formValue.services = selectedServices;

    // Format time fields if necessary
    if (formValue.reservationStart.length < 8) {
      formValue.reservationStart = this.formatTime(formValue.reservationStart);
    }
    if (formValue.reservationEnd.length < 8) {
      formValue.reservationEnd = this.formatTime(formValue.reservationEnd);
    }

  //console.log('Updating reservation with data:', formValue);

    this.reservationService.updateReservation(this.data.reservationId, formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
        //console.log('Reservation updated successfully:', response.message);
          alert(response.message);

          // Don't need to update slots here - parent will handle refresh
          this.isSubmitting = false;
          this.dialogRef.close('updated');
          location.reload();
 // Indicate successful update
        },
        error: (err) => {
          console.error('Error updating reservation:', err);
          alert(err.error?.message || 'Failed to update reservation');
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
  }

  onCheckboxChange(service: string, event: any): void {
    this.selectedServices[service] = event.target.checked;
  //console.log('Service selection changed:', this.selectedServices);
  }

  formatTime(time: string): string {
    // Add ':00' to the time string to make it in the format 'hh:mm:00'
    return `${time}:00`;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  // Helper methods for template
  get hasServices(): boolean {
    return this.allServices.length > 0;
  }

  get selectedServicesCount(): number {
    return Object.values(this.selectedServices).filter(Boolean).length;
  }

  isFormValid(): boolean {
    return this.formData.valid && !this.isSubmitting;
  }
}