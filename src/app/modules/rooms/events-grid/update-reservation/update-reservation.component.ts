import { DatePipe } from '@angular/common';
import {
  Component, Inject, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, forkJoin, Subscription, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { LaserConfirmDialogComponent } from 'src/app/modules/receptionist/components/reservation-fm/laser-confirm-dialog/laser-confirm-dialog.component';

import { ReservationfmService } from 'src/app/modules/receptionist/services/Reservation_Form/reservationfm.service';
import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';


@Component({
  selector: 'app-update-reservation',
  templateUrl: './update-reservation.component.html',
  styleUrls: ['./update-reservation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateReservationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private subscriptions = new Subscription();

  formData: FormGroup;

  // Doctor search
  AllNames: string[] = [];
  filteredDoctors: string[] = [];
  isDoctorLoading = false;
  doctorSearchValue = '';

  // Services
  AllServices: string[] = [];
  filteredServices: string[] = [];
  serviceSearchCtrl = new FormControl('');

  // Rooms
  allRooms: any[] = [];

  isLoading = false;
  isSubmitting = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateReservationComponent>,
    private fb: FormBuilder,
    private reservationService: ReservationfmService,
    private roomService: RoomsService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    // ─── FIX #2: Log incoming data for debugging ────────────────────────────
    console.group('[UpdateReservation] 📥 Dialog opened with data:');
    console.log('reservationId  :', this.data.reservationId);
    console.log('patientName    :', this.data.patientName);
    console.log('patientPhone   :', this.data.patientPhone);
    console.log('doctorName     :', this.data.doctorName);
    console.log('reservationDate:', this.data.reservationDate);
    console.log('reservationStart:', this.data.reservationStart);
    console.log('reservationEnd :', this.data.reservationEnd);
    console.log('roomId         :', this.data.roomId);
    console.log('roomName       :', this.data.roomName);
    console.log('services       :', this.data.services);
    console.log('note           :', this.data.note);
    console.groupEnd();

    // ─── FIX #2: Start doctorName as '' — will be set after form renders ────
    this.formData = this.fb.group({
      patientName: [this.data.patientName],
      patientPhone: [this.data.patientPhone],
      reservationId: [this.data.reservationId],
      doctorName: ['', Validators.required],   // populated after load
      reservationDate: [new Date(this.data.reservationDate), Validators.required],
      reservationStart: [this.data.reservationStart, Validators.required],
      reservationEnd: [this.data.reservationEnd, Validators.required],
      note: [this.data.note],
      roomId: [this.data.roomId, Validators.required],
      service: this.fb.array(
        (this.data.services?.length ? this.data.services : ['']).map(
          (s: string) => this.fb.control(s, Validators.required)
        )
      )
    });
  }

  ngOnInit(): void {
    this.loadInitialData();

    // Service search filtering
    this.subscriptions.add(
      this.serviceSearchCtrl.valueChanges
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe(search => {
          this.filteredServices = search
            ? this.AllServices.filter(s => s.toLowerCase().includes(search.toLowerCase()))
            : [...this.AllServices];
          this.cdr.markForCheck();
        })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.unsubscribe();
  }

  // ── Data loading ─────────────────────────────────────────────────────────

  private loadInitialData(): void {
    this.isLoading = true;
    this.isDoctorLoading = true;
    this.cdr.markForCheck();

    forkJoin({
      doctors: this.reservationService.getAllDoctorsNames(),
      services: this.reservationService.getAllServicesNamesToRoom(this.data.roomName),
      rooms: this.roomService.getAllRoomsV2()
    }).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ doctors, services, rooms }) => {
          console.group('[UpdateReservation] ✅ loadInitialData success');
          console.log('doctors  :', doctors);
          console.log('services :', services);
          console.log('rooms    :', rooms);
          console.groupEnd();

          this.AllNames = doctors;
          this.filteredDoctors = [...doctors];
          this.AllServices = services;
          this.filteredServices = [...services];
          this.allRooms = rooms;

          this.isLoading = false;   // ← form renders NOW
          this.isDoctorLoading = false;
          this.cdr.markForCheck();

          // ─── FIX #2: Set doctor value AFTER form is in DOM ───────────────
          setTimeout(() => {
            console.log('[UpdateReservation] ⏱ Setting doctorName after render:', this.data.doctorName);
            this.formData.get('doctorName')?.setValue(this.data.doctorName, { emitEvent: false });
            this.cdr.markForCheck();
          });
        },
        error: (err) => {
          console.error('[UpdateReservation] ❌ loadInitialData error:', err);
          this.isLoading = false;
          this.isDoctorLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  // ── Room change → reload services ────────────────────────────────────────

  onRoomChange(newRoomId: string): void {
    const selectedRoom = this.allRooms.find(r => r.roomId === newRoomId);
    if (!selectedRoom) {
      console.warn('[UpdateReservation] ⚠️ onRoomChange — room not found for id:', newRoomId);
      return;
    }

    console.log('[UpdateReservation] 🏠 Room changed →', selectedRoom.roomName, '(id:', newRoomId, ')');

    this.reservationService.getAllServicesNamesToRoom(selectedRoom.roomName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (services) => {
          console.log('[UpdateReservation] 🔄 Services reloaded for room', selectedRoom.roomName, ':', services);
          this.AllServices = services;
          this.filteredServices = [...services];
          // Reset service FormArray to one empty control
          while (this.Services.length) this.Services.removeAt(0);
          this.Services.push(this.fb.control('', Validators.required));
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('[UpdateReservation] ❌ Failed to load services for room:', selectedRoom.roomName, err);
          this.AllServices = [];
          this.filteredServices = [];
          this.cdr.markForCheck();
        }
      });
  }

  // ── Doctor search ─────────────────────────────────────────────────────────

  onDoctorSearch(event: any): void {
    const value = event.target.value ?? '';
    this.doctorSearchValue = value;
    this.filteredDoctors = value.trim()
      ? this.AllNames.filter(n => n.toLowerCase().includes(value.toLowerCase()))
      : [...this.AllNames];
    this.cdr.markForCheck();
  }

  // ── Service FormArray helpers ─────────────────────────────────────────────

  get Services(): FormArray<FormControl<string | null>> {
    return this.formData.get('service') as FormArray<FormControl<string | null>>;
  }

  addService(): void {
    this.Services.push(this.fb.control('', Validators.required));
    this.cdr.detectChanges();  
  }
  removeService(index: number): void {
    if (this.Services.length > 1) {
      this.Services.removeAt(index);
      this.cdr.markForCheck();
    }
  }

  trackByDoctor(_: number, item: string): string { return item; }
  trackByService(_: number, item: string): string { return item; }

  // ── Time helpers ──────────────────────────────────────────────────────────

  getTimeDuration(): string {
    const start = this.formData.get('reservationStart')?.value;
    const end = this.formData.get('reservationEnd')?.value;
    if (!start || !end) return '';

    const s = new Date(`2000-01-01T${start}`);
    const e = new Date(`2000-01-01T${end}`);
    if (e <= s) return 'Invalid time range';

    const diff = Math.floor((e.getTime() - s.getTime()) / 60000);
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    if (hours > 0) return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    return `${minutes}m`;
  }

  private formatTime(time: string): string {
    return time && time.length < 8 ? `${time}:00` : time;
  }

  // ── Form validation ───────────────────────────────────────────────────────

  isFormValid(): boolean {
    return this.formData.valid && !this.isSubmitting;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) this.markFormGroupTouched(control);
      else if (control instanceof FormArray) {
        control.controls.forEach(c => {
          if (c instanceof FormGroup) this.markFormGroupTouched(c);
          else c.markAsTouched();
        });
      }
    });
  }

  // ── Submission ────────────────────────────────────────────────────────────

  update(): void {
    if (this.formData.invalid) {
      console.warn('[UpdateReservation] ⚠️ Form is invalid. Errors:');
      this.logFormErrors(this.formData);
      this.markFormGroupTouched(this.formData);
      return;
    }
    this.executeUpdate(false);
  }

  // ─── FIX #3: Build payload with properly mapped services array ───────────
  private buildPayload(): any {
    const formValue = { ...this.formData.value };

    if (formValue.reservationDate instanceof Date) {
      formValue.reservationDate = this.datePipe.transform(
        formValue.reservationDate, 'yyyy-MM-dd'
      );
    }
    formValue.reservationStart = this.formatTime(formValue.reservationStart);
    formValue.reservationEnd = this.formatTime(formValue.reservationEnd);

    // Map FormArray controls to a clean array, remove the raw 'service' key
    const servicesArray = this.Services.controls
      .map(c => c.value)
      .filter(v => !!v);

    delete formValue.service;          // remove raw FormArray value
    formValue.services = servicesArray; // use 'services' — adjust key to match your API

    console.group('[UpdateReservation] 📤 Payload being sent to API:');
    console.log('reservationId  :', formValue.reservationId);
    console.log('patientName    :', formValue.patientName);
    console.log('patientPhone   :', formValue.patientPhone);
    console.log('doctorName     :', formValue.doctorName);
    console.log('reservationDate:', formValue.reservationDate);
    console.log('reservationStart:', formValue.reservationStart);
    console.log('reservationEnd :', formValue.reservationEnd);
    console.log('roomId         :', formValue.roomId);
    console.log('note           :', formValue.note);
    console.log('services       :', formValue.services);
    console.log('Full payload   :', JSON.stringify(formValue, null, 2));
    console.groupEnd();

    return formValue;
  }

  private executeUpdate(confirm: boolean): void {
    this.isSubmitting = true;
    this.cdr.markForCheck();

    const payload = this.buildPayload();
    console.log(`[UpdateReservation] 🚀 Calling updateReservation — id: ${this.data.reservationId}, confirm: ${confirm}`);

    const sub = this.reservationService
      .updateReservation(this.data.reservationId, payload, confirm)
      .subscribe({
        next: (response: any) => {
          console.log('[UpdateReservation] ✅ updateReservation response:', response);
          this.isSubmitting = false;
          this.cdr.markForCheck();

          if (response.warning) {
            this.showWarningSnackBar(response.warning);
          } else {
            this.showSuccessSnackBar(response.message);
          }

          this.updateRoomReservations();
        },
        error: (err) => {
          console.error('[UpdateReservation] ❌ updateReservation error:', err);
          console.error('  status :', err.status);
          console.error('  body   :', err.error);
          this.isSubmitting = false;
          this.cdr.markForCheck();

          if (err.status === 400) {
            this.showErrorSnackBar(err.error?.message || 'This reservation cannot be updated.');
          } else if (err.status === 409 && err.error?.confirmationRequired) {
            this.openConfirmationDialog(err.error);
          } else {
            this.showErrorSnackBar(err.error?.message || 'An unexpected error occurred.');
          }
        }
      });

    this.subscriptions.add(sub);
  }

  private openConfirmationDialog(errorBody: any): void {
    const ref = this.dialog.open(LaserConfirmDialogComponent, {
      data: { message: errorBody.message, warning: errorBody.warning },
      disableClose: true,
      panelClass: 'laser-confirm-dialog-panel'
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      console.log('[UpdateReservation] 🔔 Confirmation dialog closed — confirmed:', confirmed);
      if (confirmed) this.executeUpdate(true);
    });
  }

  // ── After success: refresh + close ───────────────────────────────────────

  private updateRoomReservations(): void {
    console.log('[UpdateReservation] 🔄 Refreshing room reservations — roomId:', this.data.roomId, 'date:', this.data.reservationDate);

    const sub = this.roomService
      .getRoomWithReservations(this.data.roomId, this.data.reservationDate)
      .subscribe({
        next: (roomData) => {
          console.log('[UpdateReservation] ✅ Room reservations refreshed:', roomData);
          const reservations = Object.values(roomData).flat();
          this.roomService.updateReservationsForRoom(this.data.roomName, reservations);
          this.isSubmitting = false;
          this.cdr.markForCheck();
          this.dialogRef.close('updated');
        },
        error: (err) => {
          console.error('[UpdateReservation] ❌ Failed to refresh room reservations:', err);
          this.roomService.updateReservationsForRoom(this.data.roomName, []);
        }
      });

    this.subscriptions.add(sub);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  // ── Debug helper ──────────────────────────────────────────────────────────

  private logFormErrors(group: FormGroup | FormArray, path = ''): void {
    Object.keys((group as any).controls).forEach(key => {
      const control = (group as any).get(key);
      const fullPath = path ? `${path}.${key}` : key;
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.logFormErrors(control, fullPath);
      } else if (control?.invalid) {
        console.warn(`  ❌ ${fullPath}:`, control.errors, '| value:', control.value);
      }
    });
  }

  // ── Snackbars ─────────────────────────────────────────────────────────────

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

}