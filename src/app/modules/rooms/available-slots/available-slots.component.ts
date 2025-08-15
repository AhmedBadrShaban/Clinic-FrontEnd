import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
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
  styleUrls: ['./available-slots.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvailableSlotsComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$ = new Subject<void>();
  private lastFetchKey = '';

  @Input() roomName: string = '';
  @Input() roomId: number = 0; // add roomId like events-grid
  @Input() reservedAt: string = ''; // date
  @Input() refreshTrigger: number = 0;

  mergedArray: TimeSlot[] = [];
  reservedSlots: TimeSlot[] = [];
  isLoading: boolean = false;

  constructor(
    private datePipe: DatePipe,
    private roomServ: RoomsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.tryFetchSlots();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['roomId'] || changes['reservedAt'] || changes['refreshTrigger']) {
      this.tryFetchSlots();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private tryFetchSlots(): void {
    if (!this.roomName || !this.reservedAt) return;

    const currentFetchKey = `${this.roomId}-${this.reservedAt}-${this.refreshTrigger}`;
    if (currentFetchKey === this.lastFetchKey) return; // avoid duplicate fetch

    this.lastFetchKey = currentFetchKey;
    this.fetchAvailableSlots();
  }

  private fetchAvailableSlots(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    console.log(`Fetching slots for room ${this.roomName} on ${this.reservedAt}`);

    this.roomServ.getAvailableSlots(this.roomName, this.reservedAt)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.processSlots(data);
        },
        error: (error) => {
          console.error('Error fetching slots:', error);
          this.isLoading = false;
          this.mergedArray = [];
          this.cdr.detectChanges();
        }
      });
  }

  private processSlots(data: TimeSlot[]): void {
    this.reservedSlots = data.map(slot => ({
      ...slot,
      available: false
    }));

    if (this.reservedSlots.length > 0) {
      this.generateTimeSlots(this.reservedSlots);
    } else {
      // all day available
      this.mergedArray = [{
        startTime: '00:00:00',
        endTime: '23:59:59',
        available: true,
        width: 100
      }];
    }

    this.isLoading = false;
    this.cdr.detectChanges();
  }

  private generateTimeSlots(reserved: TimeSlot[]): void {
    const available: TimeSlot[] = [];
    const sorted = [...reserved].sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (sorted[0].startTime > '00:00:00') {
      available.push({
        startTime: '00:00:00',
        endTime: sorted[0].startTime,
        available: true,
        width: Math.max(calculateWidth('00:00:00', sorted[0].startTime), 8)
      });
    }

    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].endTime < sorted[i + 1].startTime) {
        available.push({
          startTime: sorted[i].endTime,
          endTime: sorted[i + 1].startTime,
          available: true,
          width: Math.max(calculateWidth(sorted[i].endTime, sorted[i + 1].startTime), 8)
        });
      }
    }

    if (sorted[sorted.length - 1].endTime < '23:59:59') {
      available.push({
        startTime: sorted[sorted.length - 1].endTime,
        endTime: '23:59:59',
        available: true,
        width: Math.max(calculateWidth(sorted[sorted.length - 1].endTime, '23:59:59'), 8)
      });
    }

    this.mergedArray = [
      ...reserved.map(slot => ({
        ...slot,
        width: Math.max(slot.width || calculateWidth(slot.startTime, slot.endTime), 8)
      })),
      ...available
    ].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  formatTimeTo12Hour(time: string): string {
    if (!time) return '';
    const timeAsDate = new Date(`1970-01-01T${time}`);
    return this.datePipe.transform(timeAsDate, 'h:mm a') || '';
  }

  getSlotTooltip(slot: TimeSlot): string {
    const duration = calculateDurationInHours(slot.startTime, slot.endTime);
    const status = slot.available ? 'Available' : 'Reserved';
    return `${status} • ${this.formatTimeTo12Hour(slot.startTime)} - ${this.formatTimeTo12Hour(slot.endTime)} • ${duration.toFixed(1)}h`;
  }

  onSlotClick(slot: TimeSlot): void {
    if (slot.available) {
      console.log('Selected available slot:', slot);
      // emit to parent if needed
    }
  }

  trackBySlot(index: number, slot: TimeSlot): string {
    return `${slot.startTime}-${slot.endTime}`;
  }


  getAvailableCount(): number {
    return this.mergedArray.filter(s => s.available).length;
  }

  getReservedCount(): number {
    return this.mergedArray.filter(s => !s.available).length;
  }
}

// Helpers
function calculateWidth(startTime: string, endTime: string): number {
  const slotDurationInHours = calculateDurationInHours(startTime, endTime);
  const totalDurationInHours = calculateDurationInHours('00:00:00', '23:59:59');
  return (slotDurationInHours * 100) / totalDurationInHours;
}

function calculateDurationInHours(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const durationMinutes = (eh * 60 + em) - (sh * 60 + sm);
  return durationMinutes / 60;
}
