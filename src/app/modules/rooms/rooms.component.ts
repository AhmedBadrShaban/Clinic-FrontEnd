import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, combineLatest } from 'rxjs';

import { RoomsService, Room } from '../Services/rooms/rooms.service';
import { AddNewRoomComponent } from './add-new-room/add-new-room.component';
import { AddClinicComponent } from './add-clinic/add-clinic.component';
import { ReservationFmComponent } from '../receptionist/components/reservation-fm/reservation-fm.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
 })
export class RoomsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  rooms: Room[] = [];
  allReservations: { [roomName: string]: any[] } = {};
  selectedDate: string;
  selectedTabIndex = 0;
  activeRoom!: Room ;
  loading = false;
  searchValue = '';

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private roomsService: RoomsService,
    public authService: AuthService,
    public dialog: MatDialog
  ) {
    this.selectedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
  }

  ngOnInit(): void {
    this.initializeData();
   }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeData(): void {
    this.roomsService.setLoading(true);

     this.roomsService.getAllRoomsV2()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rooms) => {
          console.log('rooms', rooms)
          this.rooms = rooms;
          // this.roomsService.updateRooms(rooms);
          // if (rooms.length > 0) {
          //   this.activeRoom = rooms[0];
          //   this.loadReservationsForDate();
          // }
        },
        error: (error) => {
          console.error('Error loading rooms:', error);
          this.roomsService.setLoading(false);
        }
      });
  }

 
  // private loadReservationsForDate(): void {
  //   this.roomsService.setLoading(true);

  //   this.roomsService.getAllReservationsByDate(this.selectedDate)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (reservations) => {
  //         this.roomsService.updateReservations(reservations);
  //         this.updateAvailableSlots();
  //         this.roomsService.setLoading(false);
  //       },
  //       error: (error) => {
  //         console.error('Error loading reservations:', error);
  //         this.roomsService.setLoading(false);
  //       }
  //     });
  // }

  private updateAvailableSlots(): void {
    if (!this.activeRoom) return;

    this.roomsService.getAvailableSlots(this.activeRoom.roomName, this.selectedDate)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (slots) => {
          this.roomsService.updateSlots(slots);
        },
        error: (error) => {
          console.error('Error loading available slots:', error);
        }
      });
  }

  onTabChange(index: number): void {
    if (index >= 0 && index < this.rooms.length) {
      this.selectedTabIndex = index;
      this.activeRoom = this.rooms[index];
      this.updateAvailableSlots();
    }
  }

  onDateChange(event: any): void {
    const newDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    if (newDate && newDate !== this.selectedDate) {
      this.selectedDate = newDate;
      // this.loadReservationsForDate();
    }
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
          if (result) {
            this.initializeData(); // Refresh rooms list
          }
        });
        break;

      case 'clinic':
        const clinicDialogRef = this.dialog.open(AddClinicComponent, dialogConfig);
        clinicDialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.initializeData(); // Refresh data
          }
        });
        break;

      case 'reservation':
        if (this.activeRoom) {
          const reservationData = {
            activeRoom: this.activeRoom,
            date: date || this.selectedDate
          };
          const reservationDialogRef = this.dialog.open(ReservationFmComponent, {
            ...dialogConfig,
            data: reservationData
          });
          reservationDialogRef.afterClosed().subscribe(result => {
            if (result) {
              // this.loadReservationsForDate(); // Refresh reservations
            }
          });
        }
        break;
    }
  }

  search(searchTerm: string): void {
    this.searchValue = searchTerm;
    // Implement search logic here if needed
    // You can filter the reservations based on patient name, phone, etc.
  }

  trackByRoomId(index: number, room: Room): number {
    return room.roomId;
  }

  get isAdmin(): boolean {
    return this.authService.userType === 'ROLE_ADMIN';
  }

  get currentRoomReservations(): any[] {
    return this.activeRoom ? (this.allReservations[this.activeRoom.roomName] || []) : [];
  }
}