import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Subject, takeUntil, BehaviorSubject, distinctUntilChanged } from 'rxjs';

import { RoomsService, Room } from '../Services/rooms/rooms.service';
import { AddNewRoomComponent } from './add-new-room/add-new-room.component';
import { AddClinicComponent } from './add-clinic/add-clinic.component';
import { ReservationFmComponent } from '../receptionist/components/reservation-fm/reservation-fm.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly STORAGE_KEY = 'rooms_selected_tab';

  // Reactive state
  private selectedDateSubject = new BehaviorSubject<string>(
    this.datePipe.transform(new Date(), 'yyyy-MM-dd') || ''
  );
  private selectedTabIndexSubject = new BehaviorSubject<number>(0);
  private refreshTriggerSubject = new BehaviorSubject<number>(0);

  // Main data
  rooms: Room[] = [];
  clinics: any[] = [];   // store clinics
  selectedClinic: string | null = null; // current selected clinic
  dataLoaded: boolean = false;
  searchValue = '';

  // Streams
  selectedDate$ = this.selectedDateSubject.asObservable();
  selectedTabIndex$ = this.selectedTabIndexSubject.asObservable();
  refreshTrigger$ = this.refreshTriggerSubject.asObservable();

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private roomsService: RoomsService,
    public authService: AuthService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.roomsService.rooms$
      .pipe(takeUntil(this.destroy$))
      .subscribe(rooms => {
        this.rooms = rooms;
        this.cdr.detectChanges();
      });

    if (this.isAdmin) {
      this.loadClinics();
    } else {
      this.initializeRooms();
    }
    this.setupReactiveStreams();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** 🔹 Fetch clinics for admins */
  private loadClinics(): void {
    this.roomsService.allClinics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clinics) => {
          this.clinics = clinics;
          if (clinics.length > 0) {
            this.selectedClinic = clinics[0].clinicName;
            this.initializeRooms(this.selectedClinic || undefined);
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading clinics:', err);
        }
      });
  }

  private initializeRooms(clinicName?: string): void {
    this.dataLoaded = false;

    this.roomsService.getAllRoomsV2(clinicName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rooms) => {
          this.rooms = rooms;
          this.dataLoaded = true;

          // ✅ Restore saved tab HERE — rooms are guaranteed to exist now
          const savedRoomId = localStorage.getItem(this.STORAGE_KEY);
          if (savedRoomId) {
            const savedIndex = this.rooms.findIndex(r => r.roomId === +savedRoomId);
            if (savedIndex !== -1) {
              this.selectedTabIndexSubject.next(savedIndex);
            }
          }

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading rooms:', error);
          this.dataLoaded = true;
          this.cdr.detectChanges();
        }
      });
  }

  /** 🔹 Triggered when clinic changes */
  onClinicChange(clinicName: string): void {
    this.selectedClinic = clinicName;
    this.initializeRooms(clinicName);
  }


  private setupReactiveStreams(): void {
    // Listen for date changes and trigger refresh
    this.selectedDate$
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((date) => {
      //console.log('Date changed:', date);
        this.triggerRefresh();
      });
  }

  private triggerRefresh(): void {
    // Increment trigger value to signal child components to refresh
    this.refreshTriggerSubject.next(this.refreshTriggerSubject.value + 1);
  }

   onTabChange(index: number): void {
    if (index >= 0 && index < this.rooms.length) {
      this.selectedTabIndexSubject.next(index);

       const room = this.rooms[index];
      if (room) {
        localStorage.setItem(this.STORAGE_KEY, String(room.roomId));
      }
    }
  }

  onDateChange(event: any): void {
    const newDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    if (newDate && newDate !== this.selectedDateSubject.value) {
      this.selectedDateSubject.next(newDate);
    }
  }

  // Refresh specific room data (called after updates)
  refreshRoomData(roomId?: number): void {
    this.triggerRefresh();
  }

  // Refresh all room data (called after major changes)
  refreshAllRoomData(): void {
    this.triggerRefresh();
  }

  openDialog(dialogType: string, room?: Room, date?: string): void {
    const dialogConfig = {
      width: '600px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    };

    switch (dialogType) {
      case 'room':
        const roomDialogRef = this.dialog.open(AddNewRoomComponent, dialogConfig);
        roomDialogRef.afterClosed().subscribe(result => {
          console.log('🚪 Room dialog closed with result:', result);
          // The subscription to rooms$ will handle the update automatically
          // No need to manually call initializeRooms again
        });
        break;

      case 'clinic':
        const clinicDialogRef = this.dialog.open(AddClinicComponent, dialogConfig);
        clinicDialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.refreshAllRoomData();
          }
        });
        break;

      case 'reservation':
        const currentRoom = this.rooms[this.selectedTabIndexSubject.value];
        if (currentRoom) {
          const reservationData = {
            activeRoom: currentRoom,
            date: date || this.selectedDateSubject.value
          };
          const reservationDialogRef = this.dialog.open(ReservationFmComponent, {
            ...dialogConfig,
            data: reservationData
          });
          reservationDialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.refreshRoomData(currentRoom.roomId);
            }
          });
        }
        break;
    }
  }
  search(searchTerm: string): void {
    this.searchValue = searchTerm;
    // Implement search logic if needed
  }

  trackByRoomId(index: number, room: Room): number {
    return room.roomId;
  }

  // Getters for template
  get selectedDate(): string {
    return this.selectedDateSubject.value;
  }

  get selectedTabIndex(): number {
    return this.selectedTabIndexSubject.value;
  }

  get activeRoom(): Room | undefined {
    const index = this.selectedTabIndexSubject.value;
    return this.rooms[index];
  }

  get activeRoomId(): number | undefined {
    const index = this.selectedTabIndexSubject.value;
    return this.rooms[index]?.roomId;
  }

  get isAdmin(): boolean {
    return this.authService.userType === 'ROLE_ADMIN';
  }

  get refreshTrigger(): number {
    return this.refreshTriggerSubject.value;
  }

  // Helper method to check if a room is the active one
  isActiveRoom(roomId: number): boolean {
    return this.activeRoomId === roomId;
  }
}