import {
  Component, Input, Output, EventEmitter,
  ChangeDetectionStrategy, OnInit
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Room } from 'src/app/shared/models/rooms.models';

@Component({
  selector: 'app-rooms-header',
  templateUrl: './rooms-header.component.html',
  styleUrls: ['./rooms-header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe]
})
export class RoomsHeaderComponent implements OnInit {
  @Input() clinics: string[] = [];
  @Input() selectedClinic: string | null = null;
  @Input() selectedDate: string = '';
  @Input() activeRoom: Room | undefined;
  @Input() isAdmin = false;
  @Input() slotPickerOpen = false;   // reflects open/close state for button label

  @Output() clinicChanged = new EventEmitter<string>();
  @Output() dateChanged = new EventEmitter<string>();
  @Output() addRoom = new EventEmitter<void>();
  @Output() addClinic = new EventEmitter<void>();
  @Output() newReservation = new EventEmitter<void>();
  @Output() viewSlots = new EventEmitter<void>();  // tells rooms.component to toggle slot picker

  dateValue: Date = new Date();

  constructor(private datePipe: DatePipe) { }

  ngOnInit(): void {
    if (this.selectedDate) {
      this.dateValue = new Date(this.selectedDate);
    }
  }

  onDatePickerChange(event: any): void {
    const formatted = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    if (formatted) this.dateChanged.emit(formatted);
  }

  onClinicSelect(value: string): void {
    this.clinicChanged.emit(value);
  }
}