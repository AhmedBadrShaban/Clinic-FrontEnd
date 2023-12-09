import { patientPackages } from 'src/app/reciptianist/models/patient-packages';
import { PatientService } from 'src/app/reciptianist/services/patient-server/patient.service';
import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ReservationsComponent } from './reservations/reservations.component';
import { ReservationsService } from '../../services/reservations-services/reservations.service';
import { PatientInfo } from '../../models/patient-Info';
import { PatientHistory } from '../../models/patient-history';
import { PatientPoints } from '../../models/patient-points';
import { AddNewPatientComponent } from '../add-new-patient/add-new-patient.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/modules/Services/Login-Services/login.service';
import { ActivatedRoute } from '@angular/router';
 @Component({
  selector: 'app-reservation',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  allPatientsData:any[]=[];
  AllDataToSearchIn:any[]=[];
   filteredData:  any[] = [];
   searchValue?:any;
  PatientInfo:PatientInfo[]=[
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
    },
  ];
patientHistory:any;
pointsHistory:PatientPoints[];
patientPackages:any;
patientReservations:any;
totalOut:number;
totalIn:number;
userType:string;

constructor(private allPatients:ReservationsService ,private patientService:PatientService,private route: ActivatedRoute , private loggedIn:LoginService, private dialogRef : MatDialog ){
  this.userType = loggedIn.userType;

  }
  ngOnInit(): void {
    if(this.userType != 'Doctor'){
    this.allPatients.getAllPatients().subscribe((data:any)=>{
      // console.log(data);
      this.allPatientsData =data;
      console.log( "data recived : " ,this.allPatientsData);

     if (Array.isArray(this.allPatientsData)) {
    this.AllDataToSearchIn = this.allPatientsData.map(allPatientsData => `${allPatientsData.primaryPhone} - ${allPatientsData.name}`);
    this.filteredData = this.AllDataToSearchIn;
    console.log(this.filteredData);
    this.extractPatientInfo();
  } else {
    console.log("there is no Patients in the system yet");
  }
    })
  }
  else
  {
    this.route.params.subscribe(params => {
      // const id = params['id'];

      // Retrieve additional data from queryParams
      this.route.queryParams.subscribe(params => {
        const phoneNumber = params['phoneNumber'];
         console.log('Phone Number Recived :', phoneNumber);
         this.allPatients.getPatientByNumber(phoneNumber).subscribe((data=>{
          this.allPatientsData[0]=data;
          console.log( "Patient Info recived : " ,this.allPatientsData[0]);
          this.extractPatientInfo();
         }))
      });
    });
  }
}

  extractPatientInfo(){
    if (this.allPatientsData?.length > 0) {
      const firstPatient = this.allPatientsData[0];
      this.patientHistory = firstPatient.patientHistory;
      this.patientPackages = firstPatient.reservedPackages;
      this.pointsHistory =firstPatient.pointHistories;
      this.patientReservations =firstPatient.patientReservations;
      this.totalIn =firstPatient.total_points_in;
      this.totalOut=firstPatient.total_points_out;
      this.PatientInfo = [
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
      ];
      // this.getPatientPointsHistory(this.PatientInfo[0].primaryPhone);


      console.log('PatientInfo:', this.PatientInfo);
      console.log(' and his history ',  this.patientHistory);
      console.log(' and his packages ',  this.patientPackages);
      console.log(' and his Points History ',  this.patientHistory);
      console.log(' and his reservations ',  this.patientReservations);
    }else {
       console.warn('Data is undefined or empty.');
      this.PatientInfo = [];
    }
   }

   search(){
    const patientPhone = this.extractPhoneNumberFromSearchResult(this.searchValue);
    this.patientService.searchPatients(patientPhone).subscribe((data:any)=>{
      this.allPatientsData[0] =data;
      this.extractPatientInfo();
     console.log( "Patient recived : " ,this.PatientInfo);
   })
  }

   onChange(value: string): void {
    this.filteredData = this.AllDataToSearchIn.filter(AllDataToSearchIn => AllDataToSearchIn.toLowerCase().indexOf(value.toLowerCase()) !== -1);
   }
   extractPhoneNumberFromSearchResult(selectedRecord: string): string | null {
     const parts = selectedRecord.split(' - ');
     if (parts.length === 2) {
       return parts[0];
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
