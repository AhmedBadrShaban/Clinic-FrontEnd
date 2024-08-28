import { AuthService } from './../../../../../shared/services/auth.service';
import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';
import { DoctorScheduleComponent } from './../doctor-schedule.component';
import { scheduleData } from './../../../models/doctor.schedule.model';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DoctorScheduleServiceService } from 'src/app/modules/receptionist/services/doctor-schedule-service/doctor-schedule-service.service';
import { ReservationfmService } from 'src/app/modules/receptionist/services/Reservation_Form/reservationfm.service';
@Component({
  selector: 'app-pop-up-form',
  templateUrl: './pop-up-form.component.html',
 })
export class PopUpFormComponent implements OnInit {
   formData: scheduleData;
   doctors:string[];
   disableEndPulse:boolean = false;
   disableStartPulses:boolean = false;
   isAdmin:boolean = false;
   rooms: any []=[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, public dialogRef: MatDialogRef<PopUpFormComponent>, private DoctorScheduleService: DoctorScheduleServiceService ,private scheduleDataService:ReservationfmService ,private roomsService:RoomsService , private loogedIn:AuthService ) {
    this.formData = data;
    if(this.formData.startPulses!=null){
      this.disableStartPulses = true;
    }
    //console.log("received data is: ", this.formData);

  }

  ngOnInit(): void {
    this.getAllDoctorsNames();
    this.getAllRoomsNames();
    if(this.formData.endPulses > 0){
      this.disableEndPulse =true;
    }
    if(this.loogedIn.userType === 'ROLE_ADMIN')
    {
      this.isAdmin = true;
    }
  }

  create() {
    delete (this.formData as any)['new'];
    //console.log('formData :>> ', this.formData);
    if( this.formData.startTime.length !== 8 ){
          this.formData.startTime = this.formatTime(this.formData.startTime);
    }
    if( this.formData.endTime.length !== 8 ){
      this.formData.endTime = this.formatTime(this.formData.endTime);
    }
    this.DoctorScheduleService.newSchedule(this.formData).subscribe({
      next: (data:any) => {
        this.closeDialog();
        this.UpdateAllSchedules();
        alert(data.message)
       },
      error: (err) => {
        alert(err.error.message)
        this.closeDialog();
        }
    });
  }


  // edit method to update a schedule
  edit() {
    if( this.formData.startTime ==  this.formData.endTime){
      alert("Start Time Cant be Equal to End Time")
      return
    }
    if( this.formData.startTime.length !== 8 ){
      this.formData.startTime = this.formatTime(this.formData.startTime);
    }
    else if( this.formData.endTime.length !== 8){
      this.formData.endTime = this.formatTime(this.formData.endTime);
    }
    //console.log('Edited Data :>> ', this.formData);
    this.DoctorScheduleService.editSchedule(this.formData).subscribe({
      next: (data) => {
        this.closeDialog();
        alert(data.message);
        this.UpdateAllSchedules();

      },
      error: (err) => {
        alert(err.error.message);
        this.closeDialog();
       }
    });
  }

  UpdateAllSchedules(){
    this.DoctorScheduleService.getAllSchedules().subscribe((data:any)=>{
  // Update the parent component's listOfData
     this.DoctorScheduleService.updateListOfData(data);
      //console.log( "data Updated : " ,data);
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    //console.log(this.formData);
  }

  getAllDoctorsNames(){
    this.scheduleDataService.getAllDoctorsNames().subscribe((data:any)=>{
      this.doctors =data;
      })
  }
  getAllRoomsNames(){
    this.roomsService.allRooms().subscribe((data:any)=>{
      this.rooms =data;
      //console.log('Rooms ', this.rooms);
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
     return `${time}:00`;
  }
  isLaserRoom(name: any): boolean {
    if(name){
      for (const room of this.rooms) {
        if (room.roomName === name && room.laser) {
          return true;
        }
      }
      return false;
    }
   return false;
  }
}
