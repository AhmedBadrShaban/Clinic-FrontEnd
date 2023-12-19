import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';
import {Component, Input, OnInit} from '@angular/core';
import { reservation} from "../../receptionist/models/event-reservation.model";
import {MatDialog} from "@angular/material/dialog";
import {DialogEventComponent} from "./dialog-event/dialog-event.component";

@Component({
  selector: 'app-events-grid',
  templateUrl: './events-grid.component.html',
  styleUrls: ['./events-grid.component.css']
})
export class EventsGridComponent implements OnInit{
  @Input() roomName:string;
  @Input() date:any;
  @Input() eventsPerRoom :reservation [] = [];

  constructor(public dialog: MatDialog , private roomsService:RoomsService) {
    console.log('roomName :>> ', this.roomName);
  }

  ngOnInit(): void {
    // this.roomsService.getRoomReservation(this.roomName , this.date).subscribe((data)=>{
    //   // this.eventsPerRoom=data;
    //    console.log("recived reservations of this room in date : " , this.date , "is: " , data )
    // })

    }
  openDialog( data : any){
    // const currentEvent = this.eventsPerDay?.[index];
    const dialogRef = this.dialog.open(DialogEventComponent,{
       data: data
    });
    dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
    });
  }

}
