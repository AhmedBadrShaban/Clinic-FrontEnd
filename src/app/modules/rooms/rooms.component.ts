import { reservation } from './../receptionist/models/event-reservation.model';
import { Component, OnInit } from '@angular/core';
 import { RoomsService } from '../Services/rooms/rooms.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddNewRoomComponent } from './add-new-room/add-new-room.component';
import { DatePipe } from '@angular/common';
import { AddClinicComponent } from './add-clinic/add-clinic.component';
import { ReservationFmComponent } from '../receptionist/components/reservation-fm/reservation-fm.component';
import { AuthService } from 'src/app/shared/services/auth.service';
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
  constructor( private datePipe:DatePipe  ,private router: Router , private allReservation:RoomsService , public loggedIn:AuthService , public dialog: MatDialog){
    this.selectedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
  }
  ngOnInit(): void {
    this.allReservation.allRoomsV2().subscribe((rooms)=>{
      this.roomsNames=rooms;
    })
    this.allReservation.rooms$.subscribe((data:any)=>{
      this.roomsNames=data;
      //console.log('Updated Rooms recived : ', this.roomsNames);
    })
    this.getAllReservations();
     this.allReservation.listOfData$.subscribe((data: any) => {
       this.allReservations = data;
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
    //console.log('tab Chenged to :>> ', this.activeTabTitle);
    this.allReservation.getAvalliableSlots(this.activeTabTitle , this.selectedDate).subscribe((data=>{
      //console.log('Update after Tab Chenges :>> ');
      this.allReservation.updateSlots(data);
    }))

  }
  openDialog(dialogType:string , currentActiveRoom:any ,date?:any){
    if(dialogType == 'room'){
    this.dialog.open(AddNewRoomComponent);
    }
    else if(dialogType == 'reservation')
    {
      //console.log('currentActiveRoom :>> ', currentActiveRoom);
      const data ={
        activeRoom:currentActiveRoom,
        date : date
      }
      this.dialog.open(ReservationFmComponent ,  {data:data} );
    }
    else if(dialogType == 'clinic'){
      this.dialog.open(AddClinicComponent);
    }
  }
  getAllReservations(){
    this.allReservation.getAllReservations(this.selectedDate).subscribe({
      next: (data) => {
        this.allReservations = data;
         //console.log( "Here is all Rooms Reservations",this.allReservations )
        },
      error: (err) => {
        //console.log("error in posting: " + err);
      }
    });
  }
  sort(){

  }
  search(key:string){
    //console.log("executing Search");
  // this.DoctorScheduleService.Search(key).subscribe((data:any)=>{
  //     // //console.log(data);
  //     this.listOfData =data;
  //     //console.log( "Search result is  : " ,this.listOfData);
  //   })
  }
  onDateChange(event: any) {
    this.selectedDate = event.value;
    this.selectedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    //console.log('selected date :>> ', this.selectedDate);
    this.getAllReservations();
    this.allReservation.getAvalliableSlots(this.activeTabTitle , this.selectedDate).subscribe((data=>{
      //console.log('Update after Date Chenges :>> ');
      this.allReservation.updateSlots(data);
    }))
    // this.DoctorScheduleService.filterByDate(formattedDate).subscribe((data:any)=>{
    //   // //console.log(data);
    //   this.listOfData =data;
    //   //console.log( "Search result is  : " ,this.listOfData);
    // })

  }
}
