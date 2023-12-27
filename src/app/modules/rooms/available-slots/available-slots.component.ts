import {Component, Input, OnInit} from '@angular/core';
import {reservation} from "../../receptionist/models/event-reservation.model";
interface TimeSlot {
  startTime: string;
  endTime: string;
}
@Component({
  selector: 'app-available-slots',
  templateUrl: './available-slots.component.html',
  styleUrls: ['./available-slots.component.css']
})
export class AvailableSlotsComponent implements OnInit{
  reservedSlots:TimeSlot[] = [
    {
      startTime: '12:38:00',
      endTime: '13:38:00'
    },
    {
      startTime: '14:20:00',
      endTime: '15:38:00'
    },
    {
      startTime: '04:33:00',
      endTime: '06:35:00'
    }
  ];
  constructor() { //assume the events are sorted
  }
  ngOnInit() {
    console.log('data :>> ', this.generateAdjustedTimeSlots(this.reservedSlots));
    }

    generateAdjustedTimeSlots(inputArray: TimeSlot[]): TimeSlot[] {
      const adjustedTimeSlots: TimeSlot[] = [];
  
      // Sort the input array based on startTime
      const sortedInputArray = inputArray.sort((a, b) => {
        return a.startTime.localeCompare(b.startTime);
      });
  
      // Generate adjusted time slots
      for (let i = 0; i < sortedInputArray.length - 1; i++) {
        const currentSlot = sortedInputArray[i];
        const nextSlot = sortedInputArray[i + 1];
  
        adjustedTimeSlots.push({
          startTime: i === 0 ? '00:00:00' : currentSlot.endTime,
          endTime: nextSlot.startTime,
        });
      }
  
       const lastSlot = sortedInputArray[sortedInputArray.length - 1];
      adjustedTimeSlots.push({
        startTime: lastSlot.endTime,
        endTime: '23:59:59',
      });
  
      return adjustedTimeSlots;
    }
  }

