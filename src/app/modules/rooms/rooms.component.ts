import { reservation } from './../../reciptianist/models/event-reservation.model';
import { Component, OnInit } from '@angular/core';
import {ServicesToReserve,reservationStatus} from "../../reciptianist/models/event-reservation.model";
import { RoomsService } from '../Services/rooms/rooms.service';
import { Router } from '@angular/router';
import { LoginService } from '../Services/Login-Services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { AddNewRoomComponent } from './add-new-room/add-new-room.component';
import { ReservationFmComponent } from 'src/app/reciptianist/components/reservation-fm/reservation-fm.component';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent implements OnInit {
  activeTabTitle: string | null = null;
  selectedTabIndex: number | null = null;
  roomsNames:any
  allReservations:any;
  selectedDate: any =new Date();
  searchValue:string;
  constructor( private datePipe:DatePipe  ,private router: Router , private allReservation:RoomsService , public loggedIn:LoginService , public dialog: MatDialog){

  }
  ngOnInit(): void {
    this.allReservation.allRooms().subscribe((rooms)=>{
      this.roomsNames=rooms;
    })
    this.getAllReservations();
     this.allReservation.listOfData$.subscribe((data: any) => {
       this.allReservations = data;
      console.log('Updated Data recived : ', this.allReservations);
     });
  }

  eventsPerDayAndRoomOne:reservation[]=[];
  onDateSelected(date: Date) {
    this.selectedDate = date;
  }
  onTabChange(event: any) {
    const selectedIndex = event;
    if (selectedIndex >= 0 && selectedIndex < this.roomsNames.length) {
      this.activeTabTitle = this.roomsNames[selectedIndex];
    } else {
      this.activeTabTitle = null;
    }
    console.log('tab Chenged to :>> ', this.activeTabTitle);
  }
  openDialog(dialogType:string , currentActiveRoom:any ,date?:any){
    if(dialogType == 'room'){
    this.dialog.open(AddNewRoomComponent);
    }
    else if(dialogType == 'reservation')
    {
      console.log('currentActiveRoom :>> ', currentActiveRoom);
      const data ={
        activeRoom:currentActiveRoom,
        date : date
      }
      this.dialog.open(ReservationFmComponent ,  {data:data} );
    }
  }
  getAllReservations(){
    this.allReservation.getAllReservations().subscribe({
      next: (data) => {
        this.allReservations = data;
         console.log( "Here is all Rooms Reservations",this.allReservations )
        },
      error: (err) => {
        console.log("error in posting: " + err);
      }
    });
  }
  search(key:string){
    console.log("executing Search");
  // this.DoctorScheduleService.Search(key).subscribe((data:any)=>{
  //     // console.log(data);
  //     this.listOfData =data;
  //     console.log( "Search result is  : " ,this.listOfData);
  //   })
  }
  onDateChange(event: any) {
    this.selectedDate = event.value;
    this.selectedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    console.log('selected date :>> ', this.selectedDate);

    // this.DoctorScheduleService.filterByDate(formattedDate).subscribe((data:any)=>{
    //   // console.log(data);
    //   this.listOfData =data;
    //   console.log( "Search result is  : " ,this.listOfData);
    // })

  }
}
