 import { Component, OnInit ,Inject} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReservationRes } from './../../models/reservation-res';
import { ReservationfmService } from '../../services/Reservation_Form/reservationfm.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PatientService } from '../../services/patient-server/patient.service';
import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';
import { DatePipe } from '@angular/common';
import { ReservationsService } from '../../services/reservations-services/reservations.service';
@Component({
  selector: 'app-reservation-fm',
  templateUrl: './reservation-fm.component.html',
  styleUrls: ['./reservation-fm.component.css']
})
export class ReservationFmComponent implements OnInit {
  reservationFm: FormGroup;
  roomName:string;
  date:any;
  patientNumber: any |null;
  allPatientsNamesAndNumbers: any[] = [];
  filteredData: any[] = [];
  AllDataToSearchIn: any[] = [];
  doctorName:any;
  AllNumbers:any[]=[];
  AllNames:any[]=[];
  FilterdNames: string[] = [];
  AllServices:any[]=[];
    constructor( @Inject(MAT_DIALOG_DATA) public data: any ,private fb: FormBuilder, private datePipe:DatePipe
    ,private reservationService:ReservationfmService , private namesAndNumbers :ReservationsService ,private roomService:RoomsService
     , public dialogRef: MatDialogRef<ReservationFmComponent>) {
    this.roomName=data.activeRoom;
    //console.log('recived room Name :>> ', this.roomName);
    //console.log('recived reservation date :>> ',  this.datePipe.transform(data.date, 'yyyy-MM-dd'),);
    this.date = data.date;
    this.reservationFm = fb.group({
      patientPhone: ['', [Validators.required, Validators.pattern('[A-Za-z]{3,}')]],
      doctorName: ['', [Validators.required, Validators.pattern('[A-Za-z]{3,}')]],
      reservationDate: this.datePipe.transform(data.date, 'yyyy-MM-dd'),
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      note: ['', [Validators.required]],
      reservedAt:[data.date],
      service: fb.array([this.fb.control('')]),
    });
  }

  ngOnInit(): void {
    this.namesAndNumbers.getPatientsNamesAndPhones().subscribe((data: any) => {
         this.allPatientsNamesAndNumbers = data;
          if (Array.isArray(this.allPatientsNamesAndNumbers)) {
           this.AllDataToSearchIn = this.allPatientsNamesAndNumbers;
           this.filteredData = this.AllDataToSearchIn;
         }
       });
       this.reservationService.getAllDoctorsNames().subscribe((data:any)=>{
         this.AllNames =data;
         //console.log('AllNames of Doctors:>> ', this.AllNames);
         this.FilterdNames = this.AllNames;
       })
       this.reservationService.getAllServicesNamesToRoom(this.roomName).subscribe((data:any)=>{
         this.AllServices=data;
         //console.log('AllServices', this.AllServices);
        })
     }

  submit() {
    let userModel:ReservationRes=this.reservationFm.value as ReservationRes;
    userModel.patientPhone =this.namesAndNumbers.extractPhoneNumberFromSearchResult(userModel.patientPhone);
    userModel.start = this.formatTime(userModel.start);
    userModel.end = this.formatTime(userModel.end);
    console.log(userModel);
    this.reservationService.addReservation(userModel , this.roomName).subscribe({
      next:(responed:any)=>{
        alert(responed.message)
         this.UpdateAllReservations();
         this.updateAvailableSlots();
        this.closeDialog();

     },
     error: (err) => {
       alert(err.error.message);

       // alert(  err.error.message);
     }



    })


    //console.log(userModel);
  }


  onChange(value: string): void {
    this.filteredData = this.AllDataToSearchIn.filter(
      (AllDataToSearchIn) =>
        AllDataToSearchIn.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    //console.log('search Value :>> ', this.searchValue);
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
    this.roomService.getAllReservations(this.date).subscribe((data:any)=>{
      this.roomService.updateData(data);
      //console.log( "data Updated : " ,data);
    })
  }
  updateAvailableSlots(){
    this.roomService.getAvalliableSlots(this.roomName , this.date).subscribe((data=>{
      //console.log('updated :>> ', data);
      this.roomService.updateSlots(data);
    }))
  }


}
