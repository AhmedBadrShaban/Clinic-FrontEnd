import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';
import {Component, Input, OnInit} from '@angular/core';
import { reservation} from "../../receptionist/models/event-reservation.model";
import {MatDialog} from "@angular/material/dialog";
import {DialogEventComponent} from "./dialog-event/dialog-event.component";
import { DatePipe } from '@angular/common';
import { PatientService } from '../../receptionist/services/patient-server/patient.service';

@Component({
  selector: 'app-events-grid',
  templateUrl: './events-grid.component.html',
  styleUrls: ['./events-grid.component.css']
})
export class EventsGridComponent implements OnInit{
  @Input() roomName:string;
  @Input() date:any;
  @Input() eventsPerRoom :reservation [] = [];

  constructor(public dialog: MatDialog , private roomsService:RoomsService , private datePipe :DatePipe ) {
    //console.log('roomName :>> ', this.roomName);
  }

  ngOnInit(): void {
    // this.roomsService.getRoomReservation(this.roomName , this.date).subscribe((data)=>{
    //   // this.eventsPerRoom=data;
    //    //console.log("recived reservations of this room in date : " , this.date , "is: " , data )
    // })

    }
  openDialog( data : any){
    // const currentEvent = this.eventsPerDay?.[index];
    data.roomName = this.roomName;
    const dialogRef = this.dialog.open(DialogEventComponent,{
       data: data
     });
    dialogRef.afterClosed().subscribe(result => {
        //console.log('The dialog was closed');
    });
  }

  formatTimeTo12Hour(time: string): string {
     if (!time) {
      return '';
    }
    const timeAsDate = new Date(`1970-01-01T${time}`);

     return this.datePipe.transform(timeAsDate, 'h:mm a') || '';
  }
  getServicesString(allServices:any[]): string {
    return allServices.join(', ');
  }

}
