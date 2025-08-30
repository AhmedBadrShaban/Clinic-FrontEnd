import { Router } from '@angular/router';
import { Component, Input, OnInit, ChangeDetectionStrategy, OnChanges, SimpleChanges, Output, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { reservation } from '../../receptionist/models/event-reservation.model';
import { DialogEventComponent } from './dialog-event/dialog-event.component';
import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';

@Component({
  selector: 'app-events-grid',
  templateUrl: './events-grid.component.html',
  styleUrls: ['./events-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsGridComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$ = new Subject<void>();
  private lastFetchKey = '';

  @Input() roomName: string = '';
  @Input() roomId: number = 0;
  @Input() date: string = '';
  @Input() refreshTrigger: number = 0; // Trigger from parent to refresh data

  @Output() dataUpdated = new EventEmitter<void>(); // Emit when data needs refresh

  eventsPerRoom: reservation[] = [];
  isLoading: boolean = false;

  constructor(
    public dialog: MatDialog,
    private roomsService: RoomsService,
    private router:Router , 
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) { }

   ngOnInit(): void {
    // Subscribe to reservations from service
    this.roomsService.reservations$
      .pipe(takeUntil(this.destroy$))
      .subscribe(reservationsMap => {
        console.log('🔔 EventsGrid received reservations update:', {
          roomName: this.roomName,
          allRoomsInMap: Object.keys(reservationsMap),
          hasDataForThisRoom: !!(this.roomName && reservationsMap[this.roomName]),
          reservationCount: reservationsMap[this.roomName]?.length || 0,
          fullReservationsMap: reservationsMap
        });

        if (this.roomName && reservationsMap[this.roomName]) {
          console.log('✅ Processing reservations for room:', this.roomName, {
            reservations: reservationsMap[this.roomName],
            currentEventsCount: this.eventsPerRoom.length
          });
          this.processReservations(reservationsMap[this.roomName]);
        } else {
          console.log('❌ No reservations found for room:', this.roomName, {
            roomNameExists: !!this.roomName,
            roomDataExists: !!(reservationsMap[this.roomName]),
            availableRooms: Object.keys(reservationsMap)
          });
        }
      });

    // Initial fetch
    this.fetchRoomReservations();
  }

 
  ngOnChanges(changes: SimpleChanges): void {
    // Fetch data when room, date, or refresh trigger changes
    if (changes['roomId'] || changes['date'] || changes['refreshTrigger']) {
      if (this.roomId && this.date) {
        this.fetchRoomReservations();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private fetchRoomReservations(): void {
    if (!this.roomId || !this.date) return;

    const currentFetchKey = `${this.roomId}-${this.date}-${this.refreshTrigger}`;
    if (currentFetchKey === this.lastFetchKey) return;

    this.lastFetchKey = currentFetchKey;
    this.isLoading = true;
    this.cdr.detectChanges();

    this.roomsService.getRoomWithReservations(this.roomId, this.date)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (roomData) => {
          const reservations = Object.values(roomData).flat();
          // ✅ Push to service subject
          this.roomsService.updateReservationsForRoom(this.roomName, reservations);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to fetch room reservations:', err);
          this.isLoading = false;
          this.roomsService.updateReservationsForRoom(this.roomName, []);
          this.cdr.detectChanges();
        }
      });
  }


  private processReservations(reservations: any[]): void {
    console.log('🔄 Processing reservations in EventsGrid:', {
      input: reservations,
      inputLength: reservations?.length || 0,
      beforeSort: this.eventsPerRoom.length
    });

    this.eventsPerRoom = this.sortEventsByTime(reservations || []);
    this.isLoading = false;

    console.log('✅ Reservations processed and sorted:', {
      finalEventsCount: this.eventsPerRoom.length,
      events: this.eventsPerRoom
    });

    this.cdr.detectChanges();
  }


  private sortEventsByTime(events: reservation[]): reservation[] {
    return events.sort((a, b) => {
      const timeA = a.reservationStart || '00:00:00';
      const timeB = b.reservationStart || '00:00:00';
      return timeA.localeCompare(timeB);
    });
  }

  openDialog(reservation: reservation): void {
    const enhancedReservation = {
      ...reservation,
      roomName: this.roomName,
      roomId: this.roomId
    };

    const dialogRef = this.dialog.open(DialogEventComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: enhancedReservation,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
      //console.log('Reservation updated, refreshing data');
        // Emit to parent to refresh data
        this.dataUpdated.emit();
      }
    });
  }

  formatTimeTo12Hour(time: string): string {
    if (!time) {
      return '';
    }
    const timeAsDate = new Date(`1970-01-01T${time}`);
    return this.datePipe.transform(timeAsDate, 'h:mm a') || '';
  }

  getServicesString(allServices: any[]): string {
    return allServices?.join(', ') || '';
  }

  getStatusIcon(status: string): string {
    const statusIcons: { [key: string]: string } = {
      'IN_PROGRESS': 'shopping_cart',
      'CONFIRMED': 'check_circle',
      'WAITING': 'hourglass_bottom',
      'TO_DOCTOR': 'medical_services',
      'DONE': 'payment',
      'CANCELLED': 'cancel',
      'COMPLETED': 'check_circle_outline'
    };
    return statusIcons[status] || 'help';
  }

  getStatusDisplayName(status: string): string {
    const statusNames: { [key: string]: string } = {
      'IN_PROGRESS': 'In Progress',
      'CONFIRMED': 'Confirmed',
      'WAITING': 'Waiting',
      'TO_DOCTOR': 'To Doctor',
      'DONE': 'Done',
      'CANCELLED': 'Cancelled',
      'COMPLETED': 'Completed'
    };
    return statusNames[status] || status;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace('_', '-');
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'IN_PROGRESS': '#ff9800',
      'CONFIRMED': '#4caf50',
      'WAITING': '#9c27b0',
      'TO_DOCTOR': '#2196f3',
      'DONE': '#00bcd4',
      'CANCELLED': '#f44336',
      'COMPLETED': '#8bc34a'
    };
    return statusColors[status] || '#666';
  }

  trackByReservationId(index: number, reservation: reservation): number {
    return reservation.reservationId || index;
  }
  checkOut(id: number): void {
  //console.log('Checking out reservation:', id);
    this.router.navigateByUrl(`receptionist/rooms/check-out/${id}`);
   }

  // Action methods
  onReservationAction(action: string, reservation: reservation, event: Event): void {
    event.stopPropagation();

    switch (action) {
      case 'confirm':
        this.changeReservationStatus(reservation.reservationId, 'CONFIRMED');
        break;
      case 'checkout':
        this.checkOut(reservation.reservationId)
        
        // Handle checkout
        break;
    }
  }

  private changeReservationStatus(reservationId: number, status: string): void {
    this.roomsService.changeReservationStatus(reservationId, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
        //console.log('Status updated:', response.message);
          this.dataUpdated.emit(); // Refresh data
        },
        error: (err) => {
          console.error('Error updating status:', err);
        }
      });
  }
}