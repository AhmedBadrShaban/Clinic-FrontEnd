 import { Component, OnInit ,Inject} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReservationRes } from './../../models/reservation-res';
import { ReservationfmService } from '../../services/Reservation_Form/reservationfm.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PatientService } from '../../services/patient-server/patient.service';
import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-reservation-fm',
  templateUrl: './reservation-fm.component.html',
  styleUrls: ['./reservation-fm.component.css']
})
export class ReservationFmComponent implements OnInit {
  reservationFm: FormGroup;
  roomName:string;
  patientphone:any;
  doctorName:any;
  AllNumbers:any[]=[];
  filteredNumbers: string[] = [];
  AllNames:any[]=[];
  FilterdNames: string[] = [];
  AllServices:any[]=[];
    constructor( @Inject(MAT_DIALOG_DATA) public data: any ,private fb: FormBuilder, private datePipe:DatePipe  ,private reservationService:ReservationfmService , private patientService:PatientService ,private roomService:RoomsService , public dialogRef: MatDialogRef<ReservationFmComponent>) {
    this.roomName=data.activeRoom;
    console.log('recived room Name :>> ', this.roomName);
    console.log('recived reservation date :>> ',  this.datePipe.transform(data.date, 'yyyy-MM-dd'),);
    this.reservationFm = fb.group({
      patientPhone: ['', [Validators.required, Validators.pattern('[A-Za-z]{3,}')]],
      doctorName: ['', [Validators.required, Validators.pattern('[A-Za-z]{3,}')]],
      reservationDate: this.datePipe.transform(data.date, 'yyyy-MM-dd'),
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      service: fb.array([this.fb.control('')]),
    });
  }
  submit() {
    let userModel:ReservationRes=this.reservationFm.value as ReservationRes;
    userModel.start = this.formatTime(userModel.start);
    userModel.end = this.formatTime(userModel.end);
    console.log(userModel);
    this.reservationService.addReservation(userModel , this.roomName).subscribe({
      next:(responed:any)=>{
        console.log("Reservation Added Successfully in Room : " , this.roomName);
        this.UpdateAllReservations();
        this.closeDialog();

     },
     error: (err) => {
       alert("Error while adding User");

       // alert(  err.error.message);
     }



    })


    console.log(userModel);
  }

  ngOnInit(): void {
    this.patientService.getAllPatientsNumbers().subscribe((numbers: any) => {
      this.AllNumbers = numbers;
      console.log('patientNumbers :>> ', this.AllNumbers);
      this.filteredNumbers = this.AllNumbers;
    });
    this.reservationService.getAllDoctorsNames().subscribe((data:any)=>{
      this.AllNames =data;
      console.log('AllNames of Doctors:>> ', this.AllNames);
      this.FilterdNames = this.AllNames;
    })
    this.reservationService.getAllServicesNames().subscribe((data:any)=>{
      this.AllServices=data;
      console.log('AllServices', this.AllServices);
     })
  }
  onChange(value: string): void {
    this.filteredNumbers = this.AllNumbers.filter(AllNumbers => AllNumbers.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
  onChange2(value: string): void {
    this.FilterdNames = this.AllNames.filter(AllNames => AllNames.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
  formatTime(time: string): string {
    // Add ':00' to the time string to make it in the format 'hh:mm:00'
    return `${time}:00`;
  }
  get Services()
  {
    return this.reservationFm.get('service') as FormArray;
  }
  addService(event:any) {
    // this.flag=false;
    this.Services.push(new FormControl());
    event.target?.classList.add('d-none');
    // this.FilterdServices =this.AllServices;
  }
  closeDialog() {
    this.dialogRef.close();
  }
  UpdateAllReservations(){
    this.roomService.getAllReservations().subscribe((data:any)=>{
      this.roomService.updateData(data);
      console.log( "data Updated : " ,data);
    })
  }


}
