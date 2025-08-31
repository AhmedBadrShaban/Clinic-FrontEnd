import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil, forkJoin, Subscription } from 'rxjs';

 
import { MatCheckboxChange } from '@angular/material/checkbox';

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
  allRooms: any[] = [];
  selectedServices: { [key: string]: boolean } = {};
  doctorName: any;
  formData: FormGroup;

  isLoading = false;
  isSubmitting = false;
  
  private subscriptions = new Subscription();

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
    console.log(this.data)
    this.formData = this.fb.group({
      patientName: [this.data.patientName],
      patientPhone: [this.data.patientPhone],
      reservationId: [this.data.reservationId],
      doctorName: [this.data.doctorName, Validators.required],
      reservationDate: [new Date(this.data.reservationDate), Validators.required],
      reservationStart: [this.data.reservationStart, Validators.required],
      reservationEnd: [this.data.reservationEnd, Validators.required],
      note: [this.data.note],
      services: [this.data.services],
      roomId: [this.data.roomId]  
    });
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

    // Load doctors, services, and rooms concurrently
    forkJoin({
      doctors: this.reservationService.getAllDoctorsNames(),
      services: this.reservationService.getAllServicesNamesToRoom(this.data.roomName),
      rooms: this.roomService.getAllRoomsV2()
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ({ doctors, services, rooms }) => {
        this.AllNames = doctors;
        this.FilterdNames = this.AllNames;
        this.allServices = services;
        this.allRooms = rooms;

        // Initialize selected services
        this.allServices.forEach(service => {
          this.selectedServices[service] = this.data.services.includes(service);
        });

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

  onRoomChange(newRoomName: string): void {
    // When room changes, reload services for the new room
    this.reservationService.getAllServicesNamesToRoom(newRoomName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (services) => {
          this.allServices = services;
          console.log('allServices', this.allServices)
          // Reset selected services when room changes
          this.selectedServices = {};
          this.allServices.forEach(service => {
            this.selectedServices[service] = false;
          });
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading services for room:', err);
        }
      });
  }

  update(): void {
    if (!this.formData.valid) {
      console.error('Form is invalid');
      return;
    }

    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.cdr.detectChanges();

    const selectedServices = Object.keys(this.selectedServices)
      .filter(service => this.selectedServices[service]);

    const formValue = { ...this.formData.value };
    console.log('formValue', formValue)
    formValue.services = selectedServices;

    // Format date
    if (formValue.reservationDate instanceof Date) {
      formValue.reservationDate = this.datePipe.transform(formValue.reservationDate, 'yyyy-MM-dd');
    }

    // Format time fields if necessary
    if (formValue.reservationStart.length < 8) {
      formValue.reservationStart = this.formatTime(formValue.reservationStart);
    }
    if (formValue.reservationEnd.length < 8) {
      formValue.reservationEnd = this.formatTime(formValue.reservationEnd);
    }

    this.reservationService.updateReservation(this.data.reservationId, formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this.updateRoomReservations()
        },
        error: (err) => {
          console.error('Error updating reservation:', err);
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
  }

  onCheckboxChange(service: string, event: MatCheckboxChange): void {
    this.selectedServices[service] = event.checked;
    this.cdr.detectChanges();  
  }

  formatTime(time: string): string {
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

  get hasSelectedServices(): boolean {
    return this.selectedServicesCount > 0;
  }

  getSelectedServicesList(): string[] {
    return Object.keys(this.selectedServices).filter(service => this.selectedServices[service]);
  }
  private updateRoomReservations(): void {
    const subscription = this.roomService.getRoomWithReservations(this.data.roomId, this.data.reservationDate)
      .subscribe({
        next: (roomData) => {
          const reservations = Object.values(roomData).flat();
          console.log('updated Reservations')
          // ✅ Update the reservations BehaviorSubject
          this.roomService.updateReservationsForRoom(this.data.roomName, reservations);
          // ✅ Now close the dialog after everything is updated
          this.isSubmitting = false;
          this.cdr.markForCheck();
          this.dialogRef.close('updated');
        },
        error: (err) => {
          console.error('Error refreshing reservations:', err);
          this.roomService.updateReservationsForRoom(this.data.roomName, []);  
        }
      });

    this.subscriptions.add(subscription);
  }
}