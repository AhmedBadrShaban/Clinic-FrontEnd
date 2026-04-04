// reservation-fm.component.ts
import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ReservationRes } from './../../models/reservation-res';
import { ReservationfmService } from '../../services/Reservation_Form/reservationfm.service';
import { PatientService } from '../../services/patient-server/patient.service';
import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';
import { ReservationsService } from '../../services/reservations-services/reservations.service';
import { LaserConfirmDialogComponent } from './laser-confirm-dialog/laser-confirm-dialog.component';

interface PatientSearchItem {
  displayText: string;
  phoneNumber: string;
  name: string;
}

const SEARCH_DEBOUNCE_TIME = 300;
const MAX_AUTOCOMPLETE_ITEMS = 50;

@Component({
  selector: 'app-reservation-fm',
  templateUrl: './reservation-fm.component.html',
  styleUrls: ['./reservation-fm.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservationFmComponent implements OnInit, OnDestroy {
  reservationFm: FormGroup;
  roomName: string;
  date: any;

  // Patient search properties
  patientSearchValue = '';
  isPatientLoading = false;
  allPatientsData: PatientSearchItem[] = [];
  filteredPatients: string[] = [];

  // Doctor search properties
  doctorSearchValue = '';
  isDoctorLoading = false;
  AllNames: string[] = [];
  filteredDoctors: string[] = [];

  // Services
  AllServices: any[] = [];

  // Form state
  isSubmitting = false;

  // Search subjects for debouncing
  private patientSearchSubject = new Subject<string>();
  private doctorSearchSubject = new Subject<string>();
  private subscriptions = new Subscription();
  serviceSearchCtrl = new FormControl('');
  filteredServices: string[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private reservationService: ReservationfmService,
    private namesAndNumbers: ReservationsService,
    private roomService: RoomsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ReservationFmComponent>,
    private cdr: ChangeDetectorRef
  ) {
  //console.log('data', data)
    this.roomName = data.activeRoom.roomName;
    this.date = data.date;

    this.initializeForm();
    this.initializeSearchDebouncing();
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.subscriptions.add(
      this.serviceSearchCtrl.valueChanges
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe(search => {
          if (!search) {
            this.filteredServices = this.AllServices;
          } else {
            this.filteredServices = this.AllServices.filter(service =>
              service.toLowerCase().includes(search.toLowerCase())
            );
          }
          this.cdr.markForCheck();
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.patientSearchSubject.complete();
    this.doctorSearchSubject.complete();
  }

  private initializeForm(): void {
    this.reservationFm = this.fb.group({
      patientPhone: ['', [Validators.required]],
      doctorName: ['', [Validators.required]],
      reservationDate: this.datePipe.transform(this.date, 'yyyy-MM-dd'),
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      note: [''],
      reservedAt: [this.date],
      service: this.fb.array([this.fb.control('', Validators.required)]),
    });
  }

  private initializeSearchDebouncing(): void {
    // Patient search debouncing
    const patientSearchSubscription = this.patientSearchSubject
      .pipe(debounceTime(SEARCH_DEBOUNCE_TIME), distinctUntilChanged())
      .subscribe((searchTerm: string) => {
        this.performPatientSearch(searchTerm);
      });

    // Doctor search debouncing  
    const doctorSearchSubscription = this.doctorSearchSubject
      .pipe(debounceTime(SEARCH_DEBOUNCE_TIME), distinctUntilChanged())
      .subscribe((searchTerm: string) => {
        this.performDoctorSearch(searchTerm);
      });

    this.subscriptions.add(patientSearchSubscription);
    this.subscriptions.add(doctorSearchSubscription);
  }

  private loadInitialData(): void {
     this.loadPatientsData();

     this.loadDoctorsData();

     this.loadServicesData();
  }

  private loadPatientsData(): void {
    this.isPatientLoading = true;
    this.cdr.markForCheck();

    const subscription = this.namesAndNumbers.getPatientsNamesAndPhonesAuto(0)
      .subscribe({
        next: (data: any) => {
          if (Array.isArray(data)) {
            this.allPatientsData = this.transformPatientData(data);
            this.filteredPatients = this.allPatientsData
              .slice(0, MAX_AUTOCOMPLETE_ITEMS)
              .map(item => item.displayText);
          }
          this.isPatientLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading patients:', error);
          this.isPatientLoading = false;
          this.cdr.markForCheck();
        }
      });

    this.subscriptions.add(subscription);
  }

  private loadDoctorsData(): void {
    this.isDoctorLoading = true;
    this.cdr.markForCheck();

    const subscription = this.reservationService.getAllDoctorsNames()
      .subscribe({
        next: (data: any) => {
          this.AllNames = data;
          this.filteredDoctors = [...this.AllNames];
          this.isDoctorLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading doctors:', error);
          this.isDoctorLoading = false;
          this.cdr.markForCheck();
        }
      });

    this.subscriptions.add(subscription);
  }

  private loadServicesData(): void {
    const subscription = this.reservationService.getAllServicesNamesToRoom(this.roomName)
      .subscribe({
        next: (data: any) => {
          this.AllServices = data;
          this.filteredServices = [...this.AllServices];
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading services:', error);
        }
      });

    this.subscriptions.add(subscription);
  }

  private transformPatientData(rawData: any[]): PatientSearchItem[] {
    if (!Array.isArray(rawData)) return [];

    return rawData.map(item => {
      if (typeof item === 'string') {
        const parts = item.split(' - ');
        return {
          displayText: item,
          name: parts[0]?.trim() || '',
          phoneNumber: parts[1]?.trim() || ''
        };
      }

      return {
        displayText: `${item.name} - ${item.phoneNumber}`,
        name: item.name || '',
        phoneNumber: item.phoneNumber || ''
      };
    });
  }

  // Patient search methods
  onPatientSearch(event: any): void {
    const value = event.target.value;
    this.patientSearchValue = value;
    this.patientSearchSubject.next(value);
  }

  private performPatientSearch(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredPatients = this.allPatientsData
        .slice(0, MAX_AUTOCOMPLETE_ITEMS)
        .map(item => item.displayText);
      this.cdr.markForCheck();
      return;
    }

    this.isPatientLoading = true;

    // Use the same search logic as the main reservation component
    const subscription = this.namesAndNumbers.getPatientsNamesAndPhonesAuto(searchTerm)
      .subscribe({
        next: (data: any) => {
          this.allPatientsData = this.transformPatientData(data);
          const lowerSearchTerm = searchTerm.toLowerCase();
          const filtered = this.allPatientsData
            .filter(item =>
              item.name.toLowerCase().includes(lowerSearchTerm) ||
              item.phoneNumber.includes(searchTerm)
            )
            .slice(0, MAX_AUTOCOMPLETE_ITEMS)
            .map(item => item.displayText);

          this.filteredPatients = filtered;
          this.isPatientLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error during patient search:', error);
          this.filteredPatients = [];
          this.isPatientLoading = false;
          this.cdr.markForCheck();
        }
      });

    this.subscriptions.add(subscription);
  }

  onPatientSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.value as string;
    this.patientSearchValue = selectedValue;
    this.reservationFm.patchValue({ patientPhone: selectedValue });
  }

  // Doctor search methods
  onDoctorSearch(event: any): void {
    const value = event.target.value;
    this.doctorSearchValue = value;
    this.doctorSearchSubject.next(value);
  }

  private performDoctorSearch(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredDoctors = [...this.AllNames];
      this.cdr.markForCheck();
      return;
    }

    this.filteredDoctors = this.AllNames.filter(doctor =>
      doctor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.cdr.markForCheck();
  }

  // Service methods
  get Services(): FormArray {
    return this.reservationFm.get('service') as FormArray;
  }

  addService(): void {
    this.Services.push(this.fb.control('', Validators.required));
    this.cdr.markForCheck();
  }

  removeService(index: number): void {
    if (this.Services.length > 1) {
      this.Services.removeAt(index);
      this.cdr.markForCheck();
    }
  }

  // Utility methods
  extractPatientName(patient: string): string {
    const parts = patient.split(' - ');
    return parts[0]?.trim() || patient;
  }

  extractPatientPhone(patient: string): string {
    const parts = patient.split(' - ');
    return parts[1]?.trim() || '';
  }

  getTimeDuration(): string {
    const start = this.reservationFm.get('start')?.value;
    const end = this.reservationFm.get('end')?.value;

    if (!start || !end) return '';

    const startTime = new Date(`2000-01-01T${start}:00`);
    const endTime = new Date(`2000-01-01T${end}:00`);

    if (endTime <= startTime) return 'Invalid time range';

    const diffMs = endTime.getTime() - startTime.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  }

  private formatTime(time: string): string {
    return `${time}:00`;
  }

  // Track by functions for performance
  trackByPatient(index: number, item: string): string {
    return item;
  }

  trackByDoctor(index: number, item: string): string {
    return item;
  }

  submit(): void {
    if (this.reservationFm.invalid) {
      this.markFormGroupTouched(this.reservationFm);
      return;
    }
    this.executeReservation(false); // always start with confirm=false
  }

  private buildPayload(): ReservationRes {
    const userModel: ReservationRes = { ...this.reservationFm.value };
    userModel.patientPhone = this.namesAndNumbers.extractPhoneNumberFromSearchResult(userModel.patientPhone);
    userModel.start = this.formatTime(userModel.start);
    userModel.end = this.formatTime(userModel.end);
    return userModel;
  }

  private executeReservation(confirm: boolean): void {
    this.isSubmitting = true;
    this.cdr.markForCheck();

    const payload = this.buildPayload();

    const subscription = this.reservationService
      .addReservation(payload, this.roomName, confirm)  // ← pass confirm param
      .subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this.cdr.markForCheck();

          // Show non-blocking warning if present alongside success
          if (response.warning) {
            this.showWarningSnackBar(response.warning);
          } else {
            this.showSuccessSnackBar(response.message);
          }

          this.updateRoomReservations();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.cdr.markForCheck();

          if (err.status === 400) {
            // Hard block — show error snackbar
            this.showErrorSnackBar(err.error?.message || 'This reservation cannot be created.');

          } else if (err.status === 409 && err.error?.confirmationRequired) {
            // Warning — ask user to confirm
            this.openConfirmationDialog(err.error);

          } else {
            this.showErrorSnackBar(err.error?.message || 'An unexpected error occurred.');
          }
        }
      });

    this.subscriptions.add(subscription);
  }

  private openConfirmationDialog(errorBody: any): void {
    const ref = this.dialog.open(LaserConfirmDialogComponent, {
      data: {
        message: errorBody.message,
        warning: errorBody.warning
      },
      disableClose: true,
      panelClass: 'laser-confirm-dialog-panel'
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.executeReservation(true); // resend with confirm=true
      }
      // if false/undefined: user cancelled, do nothing
    });
  }
  private showSuccessSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  private showWarningSnackBar(warning: string): void {
    this.snackBar.open(warning, 'Dismiss', {
      duration: 15000,
      panelClass: ['snackbar-warning'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  private showErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 15000,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(c => {
          if (c instanceof FormGroup) {
            this.markFormGroupTouched(c);
          } else {
            c.markAsTouched();
          }
        });
      }
    });
  }

 
  private updateAvailableSlots(): void {
    const subscription = this.roomService.getAvailableSlots(this.roomName, this.date)
      .subscribe((data) => {
        this.roomService.updateSlots(data);
      });

    this.subscriptions.add(subscription);
  }
  private updateRoomReservations(): void {
    const subscription = this.roomService.getRoomWithReservations(this.data.activeRoom.roomId, this.date)
      .subscribe({
        next: (roomData) => {
          const reservations = Object.values(roomData).flat();
          // ✅ Update the reservations BehaviorSubject
          this.roomService.updateReservationsForRoom(this.roomName, reservations);
          this.updateAvailableSlots();

          // ✅ Now close the dialog after everything is updated
          this.isSubmitting = false;
          this.cdr.markForCheck();
          this.closeDialog();
        },
        error: (err) => {
          console.error('Error refreshing reservations:', err);
          this.roomService.updateReservationsForRoom(this.roomName, []); // fallback
        }
      });

    this.subscriptions.add(subscription);
  }


  closeDialog(): void {
    this.dialogRef.close();
  }
}