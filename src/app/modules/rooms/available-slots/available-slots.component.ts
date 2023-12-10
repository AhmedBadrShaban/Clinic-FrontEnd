import {Component, Input, OnInit} from '@angular/core';
import {reservation} from "../../../reciptianist/models/event-reservation.model";

@Component({
  selector: 'app-available-slots',
  templateUrl: './available-slots.component.html',
  styleUrls: ['./available-slots.component.css']
})
export class AvailableSlotsComponent implements OnInit{
  @Input() eventsPerDayTO :reservation [] ;
  slots : {
    startTimeHour : number,
    StartTimeMin : number,
    EndTimeHour : number,
    EndTimeMin : number,
  } [] = [];
  constructor() { //assume the events are sorted
  }

    ngOnInit(): void {
    // console.log(this.eventsPerDayTO)
    //     for(let i = 0 ; i < this.eventsPerDayTO.length - 1 ; ++i){
    //         let startNowHours = this.eventsPerDayTO[i + 1].StartTimeHour;
    //         let startNowMin = this.eventsPerDayTO[i + 1].StartTimeMin;
    //         let EndNowMin = this.eventsPerDayTO[i].EndTimeMin;
    //         let EndNowHour = this.eventsPerDayTO[i].EndTimeHour;
    //         if(startNowHours > EndNowHour && (startNowHours - EndNowHour >= 0 && startNowMin - EndNowMin >= 0)){
    //             this.slots.push(
    //                 {
    //                     startTimeHour : EndNowHour,
    //                     StartTimeMin : EndNowMin,
    //                     EndTimeHour : startNowHours,
    //                     EndTimeMin : startNowMin,
    //                 }
    //             )
    //         }
    //     }
    //     console.log("HIIIIIII" , this.eventsPerDayTO[0 + 1])
    }
}
