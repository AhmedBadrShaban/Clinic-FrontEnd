import { Component } from '@angular/core';
import {BasicReservationData} from "../Models/basic-reservation-data";
 import {DoctorReservationsService} from "../Services/doctor-reservations.service";
import {Router} from "@angular/router";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  reservations: BasicReservationData[];
  constructor(private reservationsServ: DoctorReservationsService, private router: Router , private datePipe:DatePipe ) {
    this.getAllReservations();
   }
  getAllReservations(){
    this.reservationsServ.getAllDoctorReservation().subscribe((data)=>{
      this.reservations = data;
      //console.log('Your Reservations is :>> ', this.reservations);
    })
  }
  openReservation(phoneNumber: any , id:any) {
    //console.log("Sending");
    this.router.navigate(['doctor' ,'reservation'], { queryParams: { phoneNumber: phoneNumber  , id:id} });
  }
  formatTimeTo12Hour(time: string): string {
    if (!time) {
     return '';
   }
   const timeAsDate = new Date(`1970-01-01T${time}`);

    return this.datePipe.transform(timeAsDate, 'h:mm a') || '';
 }
}
