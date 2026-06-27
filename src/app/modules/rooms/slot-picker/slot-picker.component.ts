import {
  Component, Input, Output, EventEmitter,
  ChangeDetectionStrategy, OnChanges, SimpleChanges
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { TimeSlot } from 'src/app/shared/models/rooms.models';

type FilterMode = 'all' | 'available' | 'reserved';

@Component({
  selector: 'app-slot-picker',
  templateUrl: './slot-picker.component.html',
  styleUrls: ['./slot-picker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe]
})
export class SlotPickerComponent implements OnChanges {
  @Input() reservedSlots: TimeSlot[] = [];
  @Input() reservations: any[] = [];
  @Input() roomName = '';
  @Input() roomId = 0;
  @Input() date = '';
  @Input() isOpen = false;

  @Output() slotSelected = new EventEmitter<{ startTime: string; endTime: string }>();
  @Output() reservationClicked = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();

  allSlots: TimeSlot[] = [];
  hours = Array.from({ length: 24 }, (_, i) => i);
  filterMode: FilterMode = 'all';

  constructor(private datePipe: DatePipe) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reservedSlots'] || changes['reservations']) {
      this.buildSlots();
    }
  }

  private addMinute(time: string): string {
    const [hours, minutes, seconds] = time.split(':').map(Number);

    const date = new Date();
    date.setHours(hours, minutes, seconds || 0, 0);
    date.setMinutes(date.getMinutes() + 1);

    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return `${hh}:${mm}:${ss}`;
  }

  private buildSlots(): void {
    const reservationMap = new Map<string, any>();

    for (const res of this.reservations) {
      const key = `${res.reservationStart}|${res.reservationEnd}`;
      reservationMap.set(key, res);
    }

    const reserved: TimeSlot[] = this.reservedSlots
      .map(s => {
        const key = `${s.startTime}|${s.endTime}`;
        const matchedReservation = reservationMap.get(key);

        return {
          ...s,
          available: false,
          reservationId: matchedReservation?.reservationId,
          patientName: matchedReservation?.patientName,
          reservation: matchedReservation
        };
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const available: TimeSlot[] = [];
    const sorted = [...reserved].sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (!sorted.length) {
      available.push({
        startTime: '08:00:00',
        endTime: '22:00:00',
        available: true
      });
    } else {
      // Before the first reservation
      if (sorted[0].startTime > '08:00:00') {
        available.push({
          startTime: '08:00:00',
          endTime: sorted[0].startTime,
          available: true
        });
      }

      // Between reservations
      for (let i = 0; i < sorted.length - 1; i++) {
        const start = this.addMinute(sorted[i].endTime);
        const end = sorted[i + 1].startTime;

        if (start < end) {
          available.push({
            startTime: start,
            endTime: end,
            available: true
          });
        }
      }

      // After the last reservation
      const last = sorted[sorted.length - 1];
      const start = this.addMinute(last.endTime);

      if (start < '22:00:00') {
        available.push({
          startTime: start,
          endTime: '22:00:00',
          available: true
        });
      }
    }

    this.allSlots = [...reserved, ...available]
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }
  // ── Filter ──────────────────────────────────────────────────────────────────

  setFilter(mode: FilterMode): void {
    this.filterMode = this.filterMode === mode ? 'all' : mode;   // toggle off if same
  }

  get filteredSlots(): TimeSlot[] {
    if (this.filterMode === 'available') return this.allSlots.filter(s => s.available);
    if (this.filterMode === 'reserved') return this.allSlots.filter(s => !s.available);
    return this.allSlots;
  }

  getSlotsForHour(hour: number): TimeSlot[] {
    const hh = hour.toString().padStart(2, '0');
    return this.filteredSlots.filter(s => s.startTime.startsWith(hh));
  }

  hasAnySlotsInHour(hour: number): boolean {
    return this.getSlotsForHour(hour).length > 0;
  }

  // ── Formatting ──────────────────────────────────────────────────────────────

  formatTime(time: string): string {
    if (!time) return '';
    return this.datePipe.transform(new Date(`1970-01-01T${time}`), 'h:mm a') ?? '';
  }

  formatHour(hour: number): string {
    return this.datePipe.transform(new Date(1970, 0, 1, hour), 'h a') ?? '';
  }

  // ── Clicks ──────────────────────────────────────────────────────────────────

  onAvailableClick(slot: TimeSlot): void {
    this.slotSelected.emit({ startTime: slot.startTime, endTime: slot.endTime });
  }

  onReservedClick(slot: any): void {
    if (slot.reservation) {
      this.reservationClicked.emit(slot.reservation);
    }
  }

  // ── Getters ─────────────────────────────────────────────────────────────────

  get availableCount(): number { return this.allSlots.filter(s => s.available).length; }
  get reservedCount(): number { return this.allSlots.filter(s => !s.available).length; }

  get activeHours(): number[] {
    return this.hours.filter(h => h >= 8 && h <= 22);
  }

  trackBySlot(_: number, slot: TimeSlot): string {
    return `${slot.startTime}-${slot.endTime}`;
  }
}