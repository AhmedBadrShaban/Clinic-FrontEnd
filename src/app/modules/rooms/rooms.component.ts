import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Subject, BehaviorSubject, distinctUntilChanged, takeUntil, forkJoin } from 'rxjs';

import { AuthService } from 'src/app/shared/services/auth.service';
import { AddClinicComponent } from './add-clinic/add-clinic.component';
import { AddNewRoomComponent } from './add-new-room/add-new-room.component';
import { Room, RoomsService } from 'src/app/modules/Services/rooms/rooms.service';
import { TimeSlot } from 'src/app/shared/models/rooms.models';
import { ReservationFmComponent } from 'src/app/modules/receptionist/components/reservation-fm/reservation-fm.component';
import { DialogEventComponent } from './events-grid/dialog-event/dialog-event.component';

const DIALOG_CONFIG = {
  width: '820px',
  maxHeight: '90vh',
  panelClass: 'reservation-dialog-panel'
};

const STORAGE_KEY = 'rooms_selected_tab';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private selectedDateSubject = new BehaviorSubject<string>(
    this.datePipe.transform(new Date(), 'yyyy-MM-dd') ?? ''
  );
  private selectedTabIndexSubject = new BehaviorSubject<number>(0);
  private refreshTriggerSubject = new BehaviorSubject<number>(0);

  rooms: Room[] = [];
  clinics: string[] = [];
  selectedClinic: string | null = null;
  dataLoaded = false;

  // ── Slot picker state (owned here, not in room-tabs) ──────────────────────
  slotPickerOpen = false;
  activeRoomSlots: TimeSlot[] = [];
  activeRoomReservations: any[] = [];
  isSlotLoading = false;

  selectedDate$ = this.selectedDateSubject.asObservable();
  selectedTabIndex$ = this.selectedTabIndexSubject.asObservable();
  refreshTrigger$ = this.refreshTriggerSubject.asObservable();

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private roomsService: RoomsService,
    public authService: AuthService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  // ── Lifecycle ───────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.roomsService.rooms$
      .pipe(takeUntil(this.destroy$))
      .subscribe(rooms => { this.rooms = rooms; this.cdr.detectChanges(); });

    this.isAdmin ? this.loadClinics() : this.loadRooms();
    this.listenToDateChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Data loading ────────────────────────────────────────────────────────────

  private loadClinics(): void {
    this.roomsService.allClinics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clinics) => {
          this.clinics = clinics.map((c: any) => c.clinicName ?? c);
          if (this.clinics.length) {
            this.selectedClinic = this.clinics[0];
            this.loadRooms(this.selectedClinic);
          }
          this.dataLoaded = true;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error loading clinics:', err)
      });
  }

  private loadRooms(clinicName?: string): void {
    this.dataLoaded = false;
    this.roomsService.getAllRoomsV2(clinicName ?? undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rooms) => {
          this.rooms = rooms;
          this.dataLoaded = true;
          this.restoreSavedTab();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading rooms:', err);
          this.dataLoaded = true;
          this.cdr.detectChanges();
        }
      });
  }

  private restoreSavedTab(): void {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const idx = this.rooms.findIndex(r => r.roomId === +saved);
    if (idx !== -1) this.selectedTabIndexSubject.next(idx);
  }

  private listenToDateChanges(): void {
    this.selectedDate$
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.closeSlotPicker();   // reset panel when date changes
        this.triggerRefresh();
      });
  }

  private triggerRefresh(): void {
    this.refreshTriggerSubject.next(this.refreshTriggerSubject.value + 1);
  }

  private closeSlotPicker(): void {
    this.slotPickerOpen = false;
    this.activeRoomSlots = [];
    this.activeRoomReservations = [];
  }

  // ── Slot picker ─────────────────────────────────────────────────────────────

  onViewSlots(): void {
    const room = this.activeRoom;
    if (!room) return;

    // Toggle close
    if (this.slotPickerOpen) {
      this.closeSlotPicker();
      this.cdr.detectChanges();
      return;
    }

    this.slotPickerOpen = true;
    this.isSlotLoading = true;
    this.cdr.detectChanges();

    forkJoin({
      slots: this.roomsService.getAvailableSlots(room.roomName, this.selectedDate),
      roomData: this.roomsService.getRoomWithReservations(room.roomId, this.selectedDate)
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ slots, roomData }) => {
          this.activeRoomSlots = slots;
          this.activeRoomReservations = Object.values(roomData).flat() as any[];
          this.isSlotLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading slot picker data:', err);
          this.closeSlotPicker();
          this.isSlotLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onSlotPickerClosed(): void {
    this.closeSlotPicker();
    this.cdr.detectChanges();
  }

  onSlotSelected(slot: { startTime: string; endTime: string }): void {
    this.closeSlotPicker();
    this.onOpenReservationWithSlot({
      ...slot,
      roomId: this.activeRoom?.roomId ?? 0,
      roomName: this.activeRoom?.roomName ?? '',
      date: this.selectedDate
    });
  }

  // ── Event handlers ──────────────────────────────────────────────────────────

  onClinicChanged(clinicName: string): void {
    this.selectedClinic = clinicName;
    this.loadRooms(clinicName);
  }

  onDateChanged(date: string): void {
    if (date && date !== this.selectedDateSubject.value) {
      this.selectedDateSubject.next(date);
    }
  }

  onTabChanged(index: number): void {
    if (index < 0 || index >= this.rooms.length) return;
    this.selectedTabIndexSubject.next(index);
    this.closeSlotPicker();   // close panel when switching tabs
    this.cdr.detectChanges();
    const room = this.rooms[index];
    if (room) localStorage.setItem(STORAGE_KEY, String(room.roomId));
  }

  onRoomDataUpdated(roomId?: number): void {
    this.triggerRefresh();
  }

  // ── Dialog launchers ────────────────────────────────────────────────────────

  openAddRoomDialog(): void {
    this.dialog.open(AddNewRoomComponent, DIALOG_CONFIG);
  }

  openAddClinicDialog(): void {
    this.dialog.open(AddClinicComponent, DIALOG_CONFIG)
      .afterClosed().subscribe(result => { if (result) this.triggerRefresh(); });
  }

  openNewReservationDialog(): void {
    const currentRoom = this.activeRoom;
    if (!currentRoom) return;

    this.dialog.open(ReservationFmComponent, {
      ...DIALOG_CONFIG,
      data: { activeRoom: currentRoom, date: this.selectedDate }
    }).afterClosed().subscribe(result => {
      if (result) this.triggerRefresh();
    });
  }

  onOpenReservationWithSlot(data: { startTime: string; endTime: string; roomId: number; roomName: string; date: string }): void {
    const room = this.rooms.find(r => r.roomId === data.roomId);
    if (!room) return;

    const startHHmm = data.startTime.substring(0, 5);
    const endHHmm = data.endTime.substring(0, 5);

    this.dialog.open(ReservationFmComponent, {
      ...DIALOG_CONFIG,
      data: {
        activeRoom: room,
        date: data.date,
        prefilledStart: startHHmm,
        prefilledEnd: endHHmm
      }
    }).afterClosed().subscribe(result => {
      if (result) this.triggerRefresh();
    });
  }

  onViewReservation(reservation: any): void {
    const activeRoom = this.activeRoom;
    this.closeSlotPicker();
    this.dialog.open(DialogEventComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: { ...reservation, roomName: activeRoom?.roomName, roomId: activeRoom?.roomId },
      panelClass: 'custom-dialog-container'
    }).afterClosed().subscribe(result => {
      if (result === 'updated') this.triggerRefresh();
    });
  }

  // ── Computed getters ────────────────────────────────────────────────────────

  get selectedDate(): string { return this.selectedDateSubject.value; }
  get selectedTabIndex(): number { return this.selectedTabIndexSubject.value; }
  get refreshTrigger(): number { return this.refreshTriggerSubject.value; }
  get isAdmin(): boolean { return this.authService.userType === 'ROLE_ADMIN'; }

  get activeRoom(): Room | undefined {
    return this.rooms[this.selectedTabIndexSubject.value];
  }

  isActiveRoom(roomId: number): boolean {
    return this.activeRoom?.roomId === roomId;
  }

  trackByRoomId(_: number, room: Room): number {
    return room.roomId;
  }
}