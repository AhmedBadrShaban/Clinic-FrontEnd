import {
  Component, Input, Output, EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Reservation } from 'src/app/shared/models/rooms.models';
 
@Component({
  selector: 'app-reservation-card',
  templateUrl: './reservation-card.component.html',
  styleUrls: ['./reservation-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe]
})
export class ReservationCardComponent {
  @Input() reservation!: Reservation;
  @Input() animationDelay = 0;

  @Output() cardClicked = new EventEmitter<Reservation>();
  @Output() confirmClicked = new EventEmitter<Reservation>();
  @Output() checkoutClicked = new EventEmitter<Reservation>();

  constructor(private datePipe: DatePipe) { }

  get statusClass(): string {
    return 'status-' + (this.reservation.status ?? '').toLowerCase().replace(/_/g, '-');
  }

  get statusIcon(): string {
    const map: Record<string, string> = {
      IN_PROGRESS: 'shopping_cart',
      CONFIRMED: 'check_circle',
      WAITING: 'hourglass_bottom',
      TO_DOCTOR: 'medical_services',
      DONE: 'payment',
      CANCELLED: 'cancel',
      CANCELED: 'cancel',
      COMPLETED: 'check_circle_outline'
    };
    return map[this.reservation.status] ?? 'help';
  }

  get statusLabel(): string {
    const map: Record<string, string> = {
      IN_PROGRESS: 'In Progress',
      CONFIRMED: 'Confirmed',
      WAITING: 'Waiting',
      TO_DOCTOR: 'To Doctor',
      DONE: 'Done',
      CANCELLED: 'Cancelled',
      CANCELED: 'Cancelled',
      COMPLETED: 'Completed'
    };
    return map[this.reservation.status] ?? this.reservation.status;
  }

  get isWaitingOrInProgress(): boolean {
    return ['WAITING', 'IN_PROGRESS'].includes(this.reservation.status);
  }

  get isDone(): boolean {
    return this.reservation.status === 'DONE';
  }

  get servicesSummary(): string {
    return this.reservation.services?.join(', ') ?? '';
  }

  formatTime(time: string): string {
    if (!time) return '';
    return this.datePipe.transform(new Date(`1970-01-01T${time}`), 'h:mm a') ?? '';
  }

  onConfirm(event: Event): void {
    event.stopPropagation();
    this.confirmClicked.emit(this.reservation);
  }

  onCheckout(event: Event): void {
    event.stopPropagation();
    this.checkoutClicked.emit(this.reservation);
  }
}