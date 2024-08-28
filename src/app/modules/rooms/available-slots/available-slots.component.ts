import {Component, Input, OnInit} from '@angular/core';
import {reservation} from "../../receptionist/models/event-reservation.model";
import { DatePipe } from '@angular/common';
import { RoomsService } from '../../Services/rooms/rooms.service';
interface TimeSlot {
  startTime: string;
  endTime: string;
  available?: boolean;
  width?:number;

}
@Component({
  selector: 'app-available-slots',
  templateUrl: './available-slots.component.html',
  styleUrls: ['./available-slots.component.css']
})
export class AvailableSlotsComponent implements OnInit{
    dataLoaded :boolean=false;;
    @Input() roomName:any;
    @Input() reservedAt:any;

   mergedArray: TimeSlot[] = [];
    reservedSlots:TimeSlot[] = [];
  constructor(private datePipe:DatePipe , private roomServ:RoomsService) {

  }
  ngOnInit() {
    //console.log('in Available slots :>> ');
    this.roomServ.updateSlots$.subscribe((data)=>{
      //console.log('Waiting Dtaaaa :>> ');
      this.reservedSlots = data;
      if(data.length>0){
        this.formateSlots();
        this.dataLoaded = true;
        //console.log('Updated Slots Recived :>>' , this.reservedSlots  );
       }
       else
       {
        this.mergedArray =[
          {
            startTime: '00:00:00',
            endTime: '23:59:59',
            available:true,
            width:100
           },
        ]
        this.dataLoaded = true;

       }

    })
 }

 formateSlots(){
  this.reservedSlots = this.reservedSlots.map((slot) => ({
    ...slot,
    available: false,
    // width: calculateWidth(slot.startTime, slot.endTime)
  }));
  this.generateTimeSlots(this.reservedSlots);
 }

    generateTimeSlots(inputArray: TimeSlot[]){
      const availableTimeSlots: TimeSlot[] = [];

      const sortedInputArray = inputArray.sort((a, b) => {
        return a.startTime.localeCompare(b.startTime);
      });

      //console.log('sortedInputArray :>> ', sortedInputArray);

      if (sortedInputArray.length > 0 && sortedInputArray[0].startTime > '00:00:00') {
        availableTimeSlots.push({
          startTime: '00:00:00',
          endTime: sortedInputArray[0].startTime,
          available:true,
          width: calculateWidth('00:00:00', sortedInputArray[0].startTime)
        });
      }


      for (let i = 0; i < sortedInputArray.length - 1; i++) {
        const currentSlot = sortedInputArray[i];
        const nextSlot = sortedInputArray[i + 1];

        availableTimeSlots.push({
          startTime: currentSlot.endTime,
          endTime: nextSlot.startTime,
          available:true,
          width: calculateWidth(currentSlot.endTime, nextSlot.startTime)
        });
      }


       const lastSlot = sortedInputArray[sortedInputArray.length - 1];
       availableTimeSlots.push({
        startTime: lastSlot.endTime,
        endTime: '23:59:59',
        available:true,
        width: calculateWidth(lastSlot.endTime, '23:59:59')
      });
      //console.log('adjustedTimeSlots :>> ', availableTimeSlots);
      this.mergedArray=[];
      this.mergedArray.push(...this.reservedSlots, ...availableTimeSlots)
      this.mergedArray.sort((a, b) => a.startTime.localeCompare(b.startTime));
      //console.log('Final Slots :>> ', this.mergedArray);
    }

    formatTimeTo12Hour(time: string): string {
      if (!time) {
       return '';
     }
     const timeAsDate = new Date(`1970-01-01T${time}`);

      return this.datePipe.transform(timeAsDate, 'h:mm a') || '';
   }


  }





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
