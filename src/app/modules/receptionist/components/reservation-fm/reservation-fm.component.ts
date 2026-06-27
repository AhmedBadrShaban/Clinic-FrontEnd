// reservation-fm.component.ts
import {
  Component, OnInit, OnDestroy, Inject,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {
  FormArray, FormBuilder, FormControl,
  FormGroup, Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

import { ReservationRes } from './../../models/reservation-res';
import { ReservationfmService } from '../../services/Reservation_Form/reservationfm.service';
import { PatientService } from '../../services/patient-server/patient.service';
import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';
import { ReservationsService } from '../../services/reservations-services/reservations.service';
import { LaserConfirmDialogComponent } from './laser-confirm-dialog/laser-confirm-dialog.component';

// ── Types ────────────────────────────────────────────────────────────────────

interface PatientSearchItem {
  displayText: string;
  phoneNumber: string;
  name: string;
}

// ── Constants ────────────────────────────────────────────────────────────────

const SEARCH_DEBOUNCE = 300;
const MAX_AUTOCOMPLETE = 50;
const SNACK_DURATION_SUCCESS = 4_000;
const SNACK_DURATION_WARN = 15_000;

// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-reservation-fm',
  templateUrl: './reservation-fm.component.html',
  styleUrls: ['./reservation-fm.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservationFmComponent implements OnInit, OnDestroy {

  // ── Form ──────────────────────────────────────────────────────────────────
  reservationFm!: FormGroup;
  serviceSearchCtrl = new FormControl('');

  // ── View data ─────────────────────────────────────────────────────────────
  roomName: string;
  date: string;

  // ── Patient search ────────────────────────────────────────────────────────
  patientSearchValue = '';
  isPatientLoading = false;
  allPatientsData: PatientSearchItem[] = [];
  filteredPatients: string[] = [];

  // ── Doctor search ─────────────────────────────────────────────────────────
  doctorSearchValue = '';
  isDoctorLoading = false;
  allDoctors: string[] = [];
  filteredDoctors: string[] = [];

  // ── Services ──────────────────────────────────────────────────────────────
  allServices: string[] = [];
  filteredServices: string[] = [];

  // ── State ─────────────────────────────────────────────────────────────────
  isSubmitting = false;

  // ── Private ───────────────────────────────────────────────────────────────
  private patientSearch$ = new Subject<string>();
  private doctorSearch$ = new Subject<string>();
  private subs = new Subscription();

  // ─────────────────────────────────────────────────────────────────────────

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
    this.roomName = data.activeRoom.roomName;
    this.date = data.date;
    this.buildForm();
    this.wireSearchDebounce();
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.loadAll();
    this.subs.add(
      this.serviceSearchCtrl.valueChanges
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe(q => {
          this.filteredServices = q
            ? this.allServices.filter(s => s.toLowerCase().includes(q.toLowerCase()))
            : [...this.allServices];
          this.cdr.markForCheck();
        })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.patientSearch$.complete();
    this.doctorSearch$.complete();
  }

  // ── Form builder ──────────────────────────────────────────────────────────

  private buildForm(): void {
    this.reservationFm = this.fb.group({
      patientPhone: ['', Validators.required],
      doctorName: ['', Validators.required],
      reservationDate: [this.datePipe.transform(this.date, 'yyyy-MM-dd')],
      start: [this.data.prefilledStart ?? '', Validators.required],
      end: [  '', Validators.required],
      note: [''],
      reservedAt: [this.date],
      service: this.fb.array([this.fb.control('', Validators.required)])
    });
  }

  // ── Search debouncing setup ───────────────────────────────────────────────

  private wireSearchDebounce(): void {
    this.subs.add(
      this.patientSearch$
        .pipe(debounceTime(SEARCH_DEBOUNCE), distinctUntilChanged())
        .subscribe(q => this.performPatientSearch(q))
    );
    this.subs.add(
      this.doctorSearch$
        .pipe(debounceTime(SEARCH_DEBOUNCE), distinctUntilChanged())
        .subscribe(q => this.performDoctorSearch(q))
    );
  }

  // ── Data loading ──────────────────────────────────────────────────────────

  private loadAll(): void {
    this.loadPatients();
    this.loadDoctors();
    this.loadServices();
  }

  private loadPatients(): void {
    this.isPatientLoading = true;
    this.cdr.markForCheck();

    this.subs.add(
      this.namesAndNumbers.getPatientsNamesAndPhonesAuto(0).subscribe({
        next: (data: any) => {
          this.allPatientsData = this.mapPatients(data);
          this.filteredPatients = this.allPatientsData.slice(0, MAX_AUTOCOMPLETE).map(p => p.displayText);
          this.isPatientLoading = false;
          this.cdr.markForCheck();
        },
        error: () => { this.isPatientLoading = false; this.cdr.markForCheck(); }
      })
    );
  }

  private loadDoctors(): void {
    this.isDoctorLoading = true;
    this.cdr.markForCheck();

    this.subs.add(
      this.reservationService.getAllDoctorsNames().subscribe({
        next: (data: string[]) => {
          this.allDoctors = data;
          this.filteredDoctors = [...data];
          this.isDoctorLoading = false;
          this.cdr.markForCheck();
        },
        error: () => { this.isDoctorLoading = false; this.cdr.markForCheck(); }
      })
    );
  }

  private loadServices(): void {
    this.subs.add(
      this.reservationService.getAllServicesNamesToRoom(this.roomName).subscribe({
        next: (data: string[]) => {
          this.allServices = data;
          this.filteredServices = [...data];
          this.cdr.markForCheck();
        },
        error: (err) => console.error('Error loading services:', err)
      })
    );
  }

  // ── Patient helpers ───────────────────────────────────────────────────────

  private mapPatients(raw: any[]): PatientSearchItem[] {
    if (!Array.isArray(raw)) return [];
    return raw.map(item => {
      if (typeof item === 'string') {
        const [name, phoneNumber] = item.split(' - ').map(s => s.trim());
        return { displayText: item, name: name ?? '', phoneNumber: phoneNumber ?? '' };
      }
      return {
        displayText: `${item.name} - ${item.phoneNumber}`,
        name: item.name ?? '',
        phoneNumber: item.phoneNumber ?? ''
      };
    });
  }

  onPatientSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.patientSearchValue = value;
    this.patientSearch$.next(value);
  }

  private performPatientSearch(q: string): void {
    if (!q.trim()) {
      this.filteredPatients = this.allPatientsData.slice(0, MAX_AUTOCOMPLETE).map(p => p.displayText);
      this.cdr.markForCheck();
      return;
    }
    this.isPatientLoading = true;
    this.subs.add(
      this.namesAndNumbers.getPatientsNamesAndPhonesAuto(q).subscribe({
        next: (data: any) => {
          this.allPatientsData = this.mapPatients(data);
          const lower = q.toLowerCase();
          this.filteredPatients = this.allPatientsData
            .filter(p => p.name.toLowerCase().includes(lower) || p.phoneNumber.includes(q))
            .slice(0, MAX_AUTOCOMPLETE)
            .map(p => p.displayText);
          this.isPatientLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.filteredPatients = [];
          this.isPatientLoading = false;
          this.cdr.markForCheck();
        }
      })
    );
  }

  onPatientSelected(event: MatAutocompleteSelectedEvent): void {
    this.patientSearchValue = event.option.value;
    this.reservationFm.patchValue({ patientPhone: event.option.value });
  }

  extractPatientName(patient: string): string { return patient.split(' - ')[0]?.trim() ?? patient; }
  extractPatientPhone(patient: string): string { return patient.split(' - ')[1]?.trim() ?? ''; }

  // ── Doctor helpers ────────────────────────────────────────────────────────

  onDoctorSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.doctorSearchValue = value;
    this.doctorSearch$.next(value);
  }

  private performDoctorSearch(q: string): void {
    this.filteredDoctors = q.trim()
      ? this.allDoctors.filter(d => d.toLowerCase().includes(q.toLowerCase()))
      : [...this.allDoctors];
    this.cdr.markForCheck();
  }

  // ── Services FormArray ────────────────────────────────────────────────────

  get Services(): FormArray { return this.reservationFm.get('service') as FormArray; }

  addService(): void {
    this.Services.push(this.fb.control('', Validators.required));
    this.cdr.markForCheck();
  }

  removeService(i: number): void {
    if (this.Services.length > 1) { this.Services.removeAt(i); this.cdr.markForCheck(); }
  }

  // ── Duration display ──────────────────────────────────────────────────────

  getTimeDuration(): string {
    const start = this.reservationFm.get('start')?.value;
    const end = this.reservationFm.get('end')?.value;
    if (!start || !end) return '';

    const s = new Date(`2000-01-01T${start}:00`);
    const e = new Date(`2000-01-01T${end}:00`);
    if (e <= s) return 'Invalid time range';

    const mins = Math.floor((e.getTime() - s.getTime()) / 60_000);
    const hours = Math.floor(mins / 60);
    const rem = mins % 60;
    return hours > 0 ? (rem > 0 ? `${hours}h ${rem}m` : `${hours}h`) : `${rem}m`;
  }

  // ── Track-by helpers ──────────────────────────────────────────────────────

  trackByPatient(_: number, item: string): string { return item; }
  trackByDoctor(_: number, item: string): string { return item; }

  // ── Submit ────────────────────────────────────────────────────────────────

  submit(): void {
    if (this.reservationFm.invalid) { this.touchAll(this.reservationFm); return; }
    this.executeReservation(false);
  }

  private buildPayload(): ReservationRes {
    const payload: ReservationRes = { ...this.reservationFm.value };
    payload.patientPhone = this.namesAndNumbers.extractPhoneNumberFromSearchResult(payload.patientPhone);
    payload.start = `${payload.start}:00`;
    payload.end = `${payload.end}:00`;
    return payload;
  }

  private executeReservation(confirm: boolean): void {
    this.isSubmitting = true;
    this.cdr.markForCheck();

    this.subs.add(
      this.reservationService.addReservation(this.buildPayload(), this.roomName, confirm).subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          this.cdr.markForCheck();
          res.warning ? this.toast(res.warning, 'warn') : this.toast(res.message, 'success');
          this.refreshRoom();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.cdr.markForCheck();

          if (err.status === 409 && err.error?.confirmationRequired) {
            this.openConfirmDialog(err.error);
          } else {
            this.toast(err.error?.message ?? 'An unexpected error occurred.', 'error');
          }
        }
      })
    );
  }

  private openConfirmDialog(errorBody: any): void {
    this.dialog.open(LaserConfirmDialogComponent, {
      data: { message: errorBody.message, warning: errorBody.warning },
      disableClose: true,
      panelClass: 'laser-confirm-dialog-panel'
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) this.executeReservation(true);
    });
  }

  // ── Post-submit room refresh ──────────────────────────────────────────────

  private refreshRoom(): void {
    this.subs.add(
      this.roomService.getRoomWithReservations(this.data.activeRoom.roomId, this.date).subscribe({
        next: (roomData) => {
          const reservations = Object.values(roomData).flat();
          this.roomService.updateReservationsForRoom(this.roomName, reservations);
          this.refreshSlots();
          this.isSubmitting = false;
          this.cdr.markForCheck();
          this.closeDialog();
        },
        error: () => this.roomService.updateReservationsForRoom(this.roomName, [])
      })
    );
  }

  private refreshSlots(): void {
    this.subs.add(
      this.roomService.getAvailableSlots(this.roomName, this.date).subscribe(data =>
        this.roomService.updateSlots(data)
      )
    );
  }

  closeDialog(): void { this.dialogRef.close(); }

  // ── Toast helper ──────────────────────────────────────────────────────────

  private toast(message: string, type: 'success' | 'warn' | 'error'): void {
    const panelMap = { success: 'snackbar-success', warn: 'snackbar-warning', error: 'snackbar-error' };
    const duration = type === 'success' ? SNACK_DURATION_SUCCESS : SNACK_DURATION_WARN;
    this.snackBar.open(message, type === 'success' ? 'Close' : 'Dismiss', {
      duration,
      panelClass: [panelMap[type]],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  // ── Form touch helper ─────────────────────────────────────────────────────

  private touchAll(group: FormGroup): void {
    Object.values(group.controls).forEach(ctrl => {
      ctrl.markAsTouched();
      if (ctrl instanceof FormGroup) this.touchAll(ctrl);
      if (ctrl instanceof FormArray) ctrl.controls.forEach(c => {
        c.markAsTouched();
        if (c instanceof FormGroup) this.touchAll(c);
      });
    });
  }
}