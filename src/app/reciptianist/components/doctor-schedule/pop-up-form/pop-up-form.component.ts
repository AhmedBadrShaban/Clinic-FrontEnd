import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';
import { DoctorScheduleComponent } from './../doctor-schedule.component';
import { scheduleData } from './../../../models/doctor.schedule.model';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DoctorScheduleServiceService } from 'src/app/reciptianist/services/doctor-schedule-service/doctor-schedule-service.service';
import { ReservationfmService } from 'src/app/reciptianist/services/Reservation_Form/reservationfm.service';
@Component({
  selector: 'app-pop-up-form',
  templateUrl: './pop-up-form.component.html',
 })
export class PopUpFormComponent implements OnInit {
   formData: scheduleData;
   doctors:string[];
   rooms:string[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, public dialogRef: MatDialogRef<PopUpFormComponent>, private DoctorScheduleService: DoctorScheduleServiceService ,private scheduleDataService:ReservationfmService ,private roomsService:RoomsService ) {
    this.formData = data;
    console.log("received data is: ", this.formData);
  }

  ngOnInit(): void {
    this.getAllDoctorsNames();
    this.getAllRoomsNames();
  }

  create() {
    delete (this.formData as any)['new'];
    this.formData.startTime = this.formatTime(this.formData.startTime);
    this.formData.endTime = this.formatTime(this.formData.endTime);
    this.DoctorScheduleService.newSchedule(this.formData).subscribe({
      next: (data) => {
        this.closeDialog();
        this.UpdateAllSchedules();
       },
      error: (err) => {
        console.log("error in posting: ", err);
      }
    });
  }


  // Add an edit method to update a schedule
  edit() {
    this.DoctorScheduleService.editSchedule(this.formData).subscribe({
      next: (data) => {
        this.closeDialog();
        this.UpdateAllSchedules();
      },
      error: (err) => {
        console.log("error in editing: ", err);
      }
    });
  }

  UpdateAllSchedules(){
    this.DoctorScheduleService.getAllSchedules().subscribe((data:any)=>{
  // Update the parent component's listOfData
     this.DoctorScheduleService.updateListOfData(data);
      console.log( "data Updated : " ,data);
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    console.log(this.formData);
  }

  getAllDoctorsNames(){
    this.scheduleDataService.getAllDoctorsNames().subscribe((data:any)=>{
      this.doctors =data;
      })
  }
  getAllRoomsNames(){
    this.roomsService.allRooms().subscribe((data:any)=>{
      this.rooms =data;
      })

  }
  convertDateFormat(inputDate: string): string {
    if (inputDate) {
      const parts = inputDate.split('/');
      if (parts.length === 3) {
        const [month, day, year] = parts;
        return `${year}-${month}-${day}`;
      }
    }
    return inputDate;
  }
  formatTime(time: string): string {
    // Add ':00' to the time string to make it in the format 'hh:mm:00'
    return `${time}:00`;
  }
}
