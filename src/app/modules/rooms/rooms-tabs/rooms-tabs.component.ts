import {
  Component, Input, Output, EventEmitter,
  ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy
} from '@angular/core';
import { Room } from 'src/app/shared/models/rooms.models';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-room-tabs',
  templateUrl: './rooms-tabs.component.html',
  styleUrls: ['./rooms-tabs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomTabsComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() rooms: Room[] = [];
  @Input() selectedIndex = 0;
  @Input() selectedDate = '';
  @Input() refreshTrigger = 0;

  @Output() tabChanged = new EventEmitter<number>();
  @Output() roomDataUpdated = new EventEmitter<number>();
  @Output() openReservationWithSlot = new EventEmitter<{ startTime: string; endTime: string; roomId: number; roomName: string; date: string }>();
  @Output() viewReservation = new EventEmitter<any>();

  constructor(public cdr: ChangeDetectorRef) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTabChange(index: number): void {
    this.tabChanged.emit(index);
  }

  trackByRoomId(_: number, room: Room): number {
    return room.roomId;
  }
}