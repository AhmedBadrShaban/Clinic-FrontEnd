import { Component, Input, OnInit, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

import { reservation } from '../../receptionist/models/event-reservation.model';
import { DialogEventComponent } from './dialog-event/dialog-event.component';
import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';

@Component({
  selector: 'app-events-grid',
  templateUrl: './events-grid.component.html',
  styleUrls: ['./events-grid.component.css'],
 })
export class EventsGridComponent implements OnInit, OnChanges {
  dataLoaded: boolean = false;
  @Input() roomName: string = '';
  @Input() roomId: number = 0;
  @Input() date: string = '';
  eventsPerRoom: reservation[] = [];

  constructor(
    public dialog: MatDialog,
    private roomsService: RoomsService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
      this.fetchRoomReservations();
   }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['roomId'] || changes['date']) {
      this.fetchRoomReservations();
    }
  }

  private fetchRoomReservations(): void {
    this.dataLoaded = false;

    if (!this.roomId || !this.date) return;

    this.roomsService.getRoomWithReservations(this.roomId, this.date).subscribe({
      next: (roomData) => {

        this.eventsPerRoom = Object.values(roomData).flat();
        this.eventsPerRoom = this.sortEventsByTime(this.eventsPerRoom);
        this.dataLoaded = true;
         console.log('room reservations', this.eventsPerRoom);
       },
      error: (err) => {
        console.error('Failed to fetch room reservations:', err);
        this.dataLoaded = true;
        this.eventsPerRoom = [];
      }
    });
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
        // Refresh data if needed
        // this.refreshData();
      }
    });
  }

  // private refreshData(): void {
  //    this.roomsService.getAllReservationsByDate(this.date).subscribe(
  //     reservations => {
  //       this.roomsService.updateReservations(reservations);
  //     }
  //   );
  // }

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
}