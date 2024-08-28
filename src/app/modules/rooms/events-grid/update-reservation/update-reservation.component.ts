import { DatePipe } from '@angular/common';
import { Component, Inject, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PatientInfo } from 'src/app/modules/receptionist/models/patient-Info';
import { PatientService } from 'src/app/modules/receptionist/services/patient-server/patient.service';
import { ReservationfmService } from 'src/app/modules/receptionist/services/Reservation_Form/reservationfm.service';
import { ReservationsService } from 'src/app/modules/receptionist/services/reservations-services/reservations.service';
import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';

@Component({
  selector: 'app-update-reservation',
  templateUrl: './update-reservation.component.html',
  styleUrls: ['./update-reservation.component.css']
})
export class UpdateReservationComponent {
  AllNames:any[]=[];
  FilterdNames: string[] = [];
  allServices:any[]=[];
  selectedServices: { [key: string]: boolean } = {};
  doctorName:any;
  formData: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any , public dialogRef: MatDialogRef<UpdateReservationComponent> , private fb: FormBuilder ,private reservationService:ReservationfmService ,
    private patientService:PatientService , private roomService:RoomsService ,private datePipe:DatePipe) {
    this.formData = this.fb.group({
      patientName:[this.data.patientName],
      patientPhone:[this.data.patientPhone],
      reservationId:[this.data.reservationId],
      doctorName: [this.data.doctorName, Validators.required],
      reservationDate: [this.data.reservationDate, Validators.required],
      reservationStart: [this.data.reservationStart, Validators.required],
      reservationEnd: [this.data.reservationEnd, Validators.required],
      note: [this.data.note],
      services:[this.data.services]
    });
    //console.log('recived reservation date :>> ',  this.datePipe.transform(data.reservationDate, 'yyyy-MM-dd'),);
   }

  ngOnInit(): void {

    //console.log('Recived Data :>> ', this.data);
    this.doctorName = this.data.doctorName;
    //console.log('doctor Name :>> ', this.doctorName);
    this.reservationService.getAllDoctorsNames().subscribe((data:any)=>{
      this.AllNames =data;
      //console.log('AllNames of Doctors:>> ', this.AllNames);
      this.FilterdNames = this.AllNames;
    })
    this.reservationService.getAllServicesNamesToRoom(this.data.roomName).subscribe((data:any)=>{
      this.allServices=data;
      this.allServices.forEach(service => {
        this.selectedServices[service] = this.data.services.includes(service);
        //console.log('serviceName :>> ', service);
      });
      //console.log('AllServices', this.allServices);
      //console.log('SelectedServices', this.selectedServices);
     })
  }

  onChange(value: string): void {
    this.FilterdNames = this.AllNames.filter(AllNames => AllNames.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
  update(): void {
    if (this.formData.valid) {
      const selectedServices = Object.keys(this.selectedServices).filter(service => this.selectedServices[service]);
       this.formData.value.services = selectedServices;
       //console.log('Form Data:', this.formData.value);
     } else {
       console.error('Form is invalid');
    }
    if(this.formData.value.reservationStart.length<8){
      this.formData.value.reservationStart = this.formatTime(this.formData.value.reservationStart);
    }
    if(this.formData.value.reservationEnd.length<8){
      this.formData.value.reservationEnd = this.formatTime(this.formData.value.reservationEnd);
    }
    this.reservationService.updateReservation(this.data.reservationId ,this.formData.value).subscribe({
      next:(responed:any)=>{
        alert(responed.message)
         this.UpdateAllReservations();
         this.updateAvailableSlots();
        this.closeDialog();

     },
     error: (err) => {
       alert(err.error.message);
      }
    })
  }

  onCheckboxChange(service: string, event: any): void {
    this.selectedServices[service] = event.target.checked;
    //console.log(this.selectedServices); // Optional: Log selected services
  }
  formatTime(time: string): string {
    // Add ':00' to the time string to make it in the format 'hh:mm:00'
    return `${time}:00`;
  }
  UpdateAllReservations(){
    this.roomService.getAllReservations(this.data.reservationDate).subscribe((data:any)=>{
      this.roomService.updateData(data);
      //console.log( "data Updated : " ,data);
    })
  }
  updateAvailableSlots(){
    this.roomService.getAvalliableSlots(this.data.roomName , this.data.reservationDate).subscribe((data=>{
      //console.log('updated :>> ', data);
      this.roomService.updateSlots(data);
    }))
  }
  closeDialog() {
    this.dialogRef.close();
  }


}
