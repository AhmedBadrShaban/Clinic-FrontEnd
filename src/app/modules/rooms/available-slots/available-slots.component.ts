// available-slots.component.ts
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RoomsService } from '../../Services/rooms/rooms.service';

interface TimeSlot {
  startTime: string;
  endTime: string;
  available?: boolean;
  width?: number;
}

@Component({
  selector: 'app-available-slots',
  templateUrl: './available-slots.component.html',
  styleUrls: ['./available-slots.component.scss']
})
export class AvailableSlotsComponent implements OnInit, OnChanges {
  dataLoaded: boolean = false;
  viewMode: 'detailed' | 'compact' = 'detailed';
  
  @Input() roomName: any;
  @Input() reservedAt: any;

  mergedArray: TimeSlot[] = [];
  reservedSlots: TimeSlot[] = [];

  constructor(private datePipe: DatePipe, private roomServ: RoomsService) {}

  ngOnInit() {
    this.fetchAvailableSlots();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['reservedAt'] || changes['roomName']) &&
      this.roomName &&
      this.reservedAt
    ) {
      this.fetchAvailableSlots();
    }
  }

  fetchAvailableSlots(): void {
    this.dataLoaded = false;
    console.log('Fetching slots for', this.roomName, 'on', this.reservedAt);

    this.roomServ.getAvailableSlots(this.roomName, this.reservedAt).subscribe((data) => {
      this.reservedSlots = data;

      if (data.length > 0) {
        this.formateSlots();
        this.dataLoaded = true;
      } else {
        this.mergedArray = [
          {
            startTime: '00:00:00',
            endTime: '23:59:59',
            available: true,
            width: 100,
          },
        ];
        this.dataLoaded = true;
      }
    });
  }

  formateSlots() {
    this.reservedSlots = this.reservedSlots.map((slot) => ({
      ...slot,
      available: false,
    }));
    this.generateTimeSlots(this.reservedSlots);
  }

  generateTimeSlots(inputArray: TimeSlot[]) {
    const availableTimeSlots: TimeSlot[] = [];

    const sortedInputArray = inputArray.sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });

    if (sortedInputArray.length > 0 && sortedInputArray[0].startTime > '00:00:00') {
      availableTimeSlots.push({
        startTime: '00:00:00',
        endTime: sortedInputArray[0].startTime,
        available: true,
        width: calculateWidth('00:00:00', sortedInputArray[0].startTime)
      });
    }

    for (let i = 0; i < sortedInputArray.length - 1; i++) {
      const currentSlot = sortedInputArray[i];
      const nextSlot = sortedInputArray[i + 1];

      availableTimeSlots.push({
        startTime: currentSlot.endTime,
        endTime: nextSlot.startTime,
        available: true,
        width: calculateWidth(currentSlot.endTime, nextSlot.startTime)
      });
    }

    const lastSlot = sortedInputArray[sortedInputArray.length - 1];
    availableTimeSlots.push({
      startTime: lastSlot.endTime,
      endTime: '23:59:59',
      available: true,
      width: calculateWidth(lastSlot.endTime, '23:59:59')
    });

    this.mergedArray = [];
    this.mergedArray.push(...this.reservedSlots, ...availableTimeSlots);
    this.mergedArray.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  formatTimeTo12Hour(time: string): string {
    if (!time) {
      return '';
    }
    const timeAsDate = new Date(`1970-01-01T${time}`);
    return this.datePipe.transform(timeAsDate, 'h:mm a') || '';
  }

  // New methods for enhanced functionality
  getAvailableCount(): number {
    return this.mergedArray.filter(slot => slot.available).length;
  }

  getReservedCount(): number {
    return this.mergedArray.filter(slot => !slot.available).length;
  }

  getTotalHours(): number {
    return Math.round(
      this.mergedArray.reduce((total, slot) => {
        return total + calculateDurationInHours(slot.startTime, slot.endTime);
      }, 0)
    );
  }

  getHourMarkers(): string[] {
    const markers = [];
    for (let i = 0; i <= 23; i += 3) {
      const hour = i.toString().padStart(2, '0');
      markers.push(`${hour}:00`);
    }
    return markers;
  }

  getSlotTooltip(slot: TimeSlot): string {
    const duration = calculateDurationInHours(slot.startTime, slot.endTime);
    const status = slot.available ? 'Available' : 'Reserved';
    return `${status} • ${this.formatTimeTo12Hour(slot.startTime)} - ${this.formatTimeTo12Hour(slot.endTime)} • ${duration.toFixed(1)}h`;
  }

  onSlotClick(slot: TimeSlot): void {
    if (slot.available) {
      // Emit event or handle available slot selection
      console.log('Selected available slot:', slot);
      // You can emit an event here to parent component
      // this.slotSelected.emit(slot);
    }
  }

  trackBySlot(index: number, slot: TimeSlot): string {
    return `${slot.startTime}-${slot.endTime}`;
  }
}

// Helper functions
function calculateWidth(startTime: string, endTime: string): number {
  const slotDurationInHours = calculateDurationInHours(startTime, endTime);
  const totalDurationInHours = calculateDurationInHours('00:00:00', '23:59:59');
  return (slotDurationInHours * 100) / totalDurationInHours;
}

function calculateDurationInHours(startTime: string, endTime: string): number {
  const startParts = startTime.split(':');
  const endParts = endTime.split(':');

  const startHours = parseInt(startParts[0]);
  const startMinutes = parseInt(startParts[1]);

  const endHours = parseInt(endParts[0]);
  const endMinutes = parseInt(endParts[1]);

  const durationInMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);

  return durationInMinutes / 60;
}