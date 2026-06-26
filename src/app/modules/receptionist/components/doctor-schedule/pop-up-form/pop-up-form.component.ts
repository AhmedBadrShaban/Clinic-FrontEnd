// pop-up-form.component.ts
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DoctorScheduleServiceService } from 'src/app/modules/receptionist/services/doctor-schedule-service/doctor-schedule-service.service';
import { ReservationfmService } from 'src/app/modules/receptionist/services/Reservation_Form/reservationfm.service';
import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { scheduleData } from '../../../models/doctor.schedule.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-pop-up-form',
    templateUrl: './pop-up-form.component.html',
    styleUrls: ['./pop-up-form.component.css'],
    standalone: true,
    imports: [MatIconModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, NgFor, MatOptionModule, NgIf, MatProgressSpinnerModule]
})
export class PopUpFormComponent implements OnInit, OnDestroy {

  formData: scheduleData;
  doctors: string[] = [];
  rooms: any[] = [];
  isAdmin = false;
  isSubmitting = false;

  // Autocomplete filtered lists
  filteredDoctors: string[] = [];
  filteredRooms: any[] = [];

  // Snapshot of values that were already persisted on the server when the dialog opened.
  // The lock rule is based on what the SERVER had — not what the user is currently typing.
  private savedStartPulses: number | null = null;
  private savedEndPulses: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopUpFormComponent>,
    private doctorScheduleService: DoctorScheduleServiceService,
    private scheduleDataService: ReservationfmService,
    private roomsService: RoomsService,
    private loggedIn: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.formData = { ...data }; // shallow copy — avoid mutating injected reference
    console.log('formdata :>> ', this.formData);
    // Snapshot what the server already has — used by pulse disable logic
    this.savedStartPulses = data.startPulses ?? null;
    this.savedEndPulses = data.endPulses ?? null;
  }

  ngOnInit(): void {
    this.isAdmin = this.loggedIn.userType === 'ROLE_ADMIN';
    this.loadDoctors();
    this.loadRooms();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

 

  get isLaser(): boolean {
    return this.isLaserRoom(this.formData.roomName);
  }

  get startPulsesDisabled(): boolean {
    if (!this.isLaser) return true;
    if (this.isAdmin) return false;

    // Receptionist: locked only if the server ALREADY had a value when the dialog opened.
    // What the user types in the current session never triggers the lock until after submit.
    return this.savedStartPulses != null && this.savedStartPulses > 0;
  }

  get endPulsesDisabled(): boolean {
    if (!this.isLaser) return true;
    if (this.isAdmin) return false;

    // End pulses require start pulses to be filled first (use live formData for this check
    // so typing a start value immediately unlocks end within the same session).
    const startFilled = (this.formData.startPulses != null && this.formData.startPulses > 0)
      || (this.savedStartPulses != null && this.savedStartPulses > 0);
    if (!startFilled) return true;

    // Locked only if the server already had an end value when the dialog opened.
    return this.savedEndPulses != null && this.savedEndPulses > 0;
  }

  // ── Form Actions ──────────────────────────────────────────

  create(): void {
    if (!this.validateForm()) return;

    // FIX: do NOT delete formData.new here — if the API returns an error the form
    // would permanently switch to edit mode. Delete it only on success.
    const payload = { ...this.formData };
    delete (payload as any)['new'];

    payload.startTime = this.ensureFullTimeFormat(payload.startTime);
    payload.endTime = this.ensureFullTimeFormat(payload.endTime);

    this.isSubmitting = true;
    this.doctorScheduleService.newSchedule(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          delete (this.formData as any)['new']; // safe to remove now — success path only
          this.showSuccess(res.message || 'Schedule created.');
          this.dialogRef.close(true); // close with result=true → parent handles refresh
        },
        error: (err) => {
          this.isSubmitting = false;
          // formData.new is still intact — form stays in create mode
          this.showError(err.error?.message || 'Failed to create schedule.');
        }
      });
  }

  edit(): void {
    if (!this.validateForm()) return;

    // FIX: was else-if — only startTime was ever fixed, endTime was skipped
    this.formData.startTime = this.ensureFullTimeFormat(this.formData.startTime);
    this.formData.endTime = this.ensureFullTimeFormat(this.formData.endTime);

    // FIX: normalize before comparing to avoid "09:00" !== "09:00:00" false negatives
    if (this.formData.startTime === this.formData.endTime) {
      this.showError('Start time and end time cannot be the same.');
      return;
    }

    this.isSubmitting = true;
    this.doctorScheduleService.editSchedule(this.formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          this.showSuccess(res.message || 'Schedule updated.');
          this.dialogRef.close(true); // close with result=true → parent handles refresh
        },
        error: (err) => {
          this.isSubmitting = false;
          this.showError(err.error?.message || 'Failed to update schedule.');
        }
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  // ── Helpers ───────────────────────────────────────────────

  private validateForm(): boolean {
    if (!this.formData.doctorName) {
      this.showError('Please select a doctor.');
      return false;
    }
    if (!this.formData.roomName) {
      this.showError('Please select a room.');
      return false;
    }
    if (!this.formData.date) {
      this.showError('Please select a date.');
      return false;
    }
    if (!this.formData.startTime) {
      this.showError('Please enter start time.');
      return false;
    }
    if (!this.formData.endTime) {
      this.showError('Please enter end time.');
      return false;
    }

if (this.isLaser) {
   if (this.formData.startPulses == null || this.formData.startPulses <= 0) {
    this.showError('Start pulses are required and must be greater than 0.');
    return false;
  }

   if (
    this.formData.endPulses != null &&
    this.formData.endPulses > 0 &&
    this.formData.startPulses > this.formData.endPulses
  ) {
    this.showError('Start pulses cannot be greater than end pulses.');
    return false;
  }
}
    return true;
  }

  /**
   * Ensures time string is in HH:mm:ss format.
   * FIX: replaces the old formatTime() which assumed input was always HH:mm.
   */
  private ensureFullTimeFormat(time: string): string {
    if (!time) return time;
    // Already full format
    if (time.length === 8) return time;
    // HH:mm → HH:mm:00
    if (time.length === 5) return `${time}:00`;
    return time;
  }

  private refreshParentList(): void {
    this.doctorScheduleService.getAllSchedules()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => this.doctorScheduleService.updateListOfData(data),
        error: () => { } // parent will show its own error if needed
      });
  }

  private loadDoctors(): void {
    this.scheduleDataService.getAllDoctorsNames()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: string[]) => {
          this.doctors = data;
          this.filteredDoctors = [...data];
        },
        error: () => this.showError('Failed to load doctors.')
      });
  }

  private loadRooms(): void {
    this.roomsService.getAllRoomsV2()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any[]) => {
          this.rooms = data;
          this.filteredRooms = [...data];
        },
        error: () => this.showError('Failed to load rooms.')
      });
  }

  // ── Autocomplete filter methods ───────────────────────────

  onDoctorSearch(value: string): void {
    const lower = (value || '').toLowerCase();
    this.filteredDoctors = this.doctors.filter(d =>
      d.toLowerCase().includes(lower)
    );
  }

  onRoomSearch(value: string): void {
    const lower = (value || '').toLowerCase();
    this.filteredRooms = this.rooms.filter(r =>
      r.roomName.toLowerCase().includes(lower)
    );
  }

  isLaserRoom(name: any): boolean {
    if (!name) return false;
    const room = this.rooms.find(r => r.roomName === name);

    // Check API flags first
    const flagResult = room?.laser ?? room?.isLaser ?? null;
    if (flagResult !== null) return flagResult;

    // TEMPORARY: fallback — infer from room name until API returns the flag
    return this.isLaserRoomByName(name);
  }

  /** TEMPORARY: infers laser room from name keywords until API provides the flag */
  private isLaserRoomByName(name: string): boolean {
    const keywords = ["laser", "lazar", "lazer"];
    return keywords.some(k => name.toLowerCase().includes(k));
  }

  convertDateFormat(inputDate: string): string {
    if (!inputDate) return inputDate;
    const parts = inputDate.split('/');
    if (parts.length === 3) {
      const [month, day, year] = parts;
      return `${year}-${month}-${day}`;
    }
    return inputDate;
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}