 import { Component, OnInit,ViewEncapsulation } from '@angular/core';
 import { ReservationsService } from '../../services/reservations-services/reservations.service';
import { PatientInfo } from '../../models/patient-Info';
 import { PatientPoints } from '../../models/patient-points';
import { AddNewPatientComponent } from '../add-new-patient/add-new-patient.component';
import { MatDialog } from '@angular/material/dialog';
 import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../services/patient-server/patient.service';
import { AuthService } from 'src/app/shared/services/auth.service';
 @Component({
  selector: 'app-reservation',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  patientData:any;
  allPatientsNamesAndNumbers:any[]=[];
  AllDataToSearchIn:any[]=[];
   filteredData:  any[] = [];
   searchValue?:any;
  PatientInfo:PatientInfo=
    {
      name:"",
      id:-1,
      gender:"",
      primaryPhone:"",
      secondaryPhone:"",
      knowUsThrough:"",
      note:"",
      date:"",
      lastReservation:"",
    }
patientHistory:any =[];
pointsHistory:PatientPoints[];
patientPackages:any=[];
patientReservations:any=[];
totalOut:number;
totalIn:number;
userType:string|null;

constructor(private allPatients:ReservationsService ,private patientService:PatientService,private route: ActivatedRoute , private loggedIn:AuthService, private dialogRef : MatDialog ){
  this.userType = loggedIn.userType;
  console.log('User Type in Reservation is :>> ' , this.userType);
  }
  ngOnInit(): void {
    if(this.userType != 'Doctor'){
    this.allPatients.getPatientsNamesAndPhones().subscribe((data:any)=>{
      // console.log(data);
      this.allPatientsNamesAndNumbers =data;
      console.log( "data recived : " ,this.allPatientsNamesAndNumbers);
     if (Array.isArray(this.allPatientsNamesAndNumbers)) {
    this.AllDataToSearchIn = this.allPatientsNamesAndNumbers;
    this.filteredData = this.AllDataToSearchIn;
    console.log(this.filteredData);
    this.allPatients.getPatientByNumber(this.extractPhoneNumberFromSearchResult(this.allPatientsNamesAndNumbers[0])).subscribe((patient1)=>{
      this.patientData =patient1;
      console.log('object :>> ', this.patientData);
      this.extractPatientInfo();
    })
    } else {
    console.log("there is no Patients in the system yet");
  }
    })

  }
  else
  {
    this.route.params.subscribe(params => {
      this.route.queryParams.subscribe(params => {
        const phoneNumber = params['phoneNumber'];
         console.log('Phone Number Recived :', phoneNumber);
         this.allPatients.getPatientByNumber(phoneNumber).subscribe((data=>{
          this.patientData=data;
          console.log( "Patient Info recived : " ,this.patientData);
          this.extractPatientInfo();
         }))
      });
    });
  }
}
  extractPatientInfo(){
      const firstPatient = this.patientData;
      this.patientHistory = firstPatient.patientHistory;
      this.patientPackages = firstPatient.reservedPackages;
      this.pointsHistory =firstPatient.pointHistories;
      this.patientReservations =firstPatient.reservations;
      this.totalIn =firstPatient.total_points_in;
      this.totalOut=firstPatient.total_points_out;
      this.PatientInfo =
        {
          date: firstPatient.date,
          gender: firstPatient.gender,
          knowUsThrough: firstPatient.knowUsThrough,
          lastReservation: firstPatient.lastReservation,
          name: firstPatient.name,
          note: firstPatient.note,
          id: firstPatient.patient_id,
          primaryPhone: firstPatient.primaryPhone,
          secondaryPhone: firstPatient.secondaryPhone
        }
       // this.getPatientPointsHistory(this.PatientInfo[0].primaryPhone);


      console.log('PatientInfo:', this.PatientInfo);
      console.log(' and his history ',  this.patientHistory);
      console.log(' and his packages ',  this.patientPackages);
      console.log(' and his Points History ',  this.pointsHistory);
      console.log(' and his reservations ',  this.patientReservations);
   }

   search(){
    const patientPhone = this.extractPhoneNumberFromSearchResult(this.searchValue);
    this.patientService.searchPatients(patientPhone).subscribe((data:any)=>{
      this.patientData =data;
      console.log( "Patient recived all data: " ,this.patientData);
      this.extractPatientInfo();
     console.log( "Patient recived : " ,this.PatientInfo);
   })
  }

   onChange(value: string): void {
    this.filteredData = this.AllDataToSearchIn.filter(AllDataToSearchIn => AllDataToSearchIn.toLowerCase().indexOf(value.toLowerCase()) !== -1);
   }
   extractPhoneNumberFromSearchResult(selectedRecord: string): string | null {
     const parts = selectedRecord.split('-');
     if (parts.length === 2) {
      console.log('Number is Fn.. :>> ',  parts[1]);
       return parts[1];
    }
     return null;
  }
  openDialog(){
    this.dialogRef.open(AddNewPatientComponent);
  }
}

  //  getPatientPointsHistory(phone:string){
  //   this.allPatients.getPatientPoints(phone).subscribe((data: any) => {
  //     this.pointsHistory = data;
  //     console.log('pointsHistory :>> ', data);
  //   });
  //  }
