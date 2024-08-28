import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReservationsService } from '../../services/reservations-services/reservations.service';
import { PatientInfo } from '../../models/patient-Info';
import { PatientPoints } from '../../models/patient-points';
import { AddNewPatientComponent } from '../add-new-patient/add-new-patient.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../services/patient-server/patient.service';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-reservation',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
})
export class ReservationComponent implements OnInit {
  patientData: any;
  selectedTab: string = 'patientInfoTab';
  patientNumber: any;
  reservationID:any;
  allPatientsNamesAndNumbers: any[] = [];
  AllDataToSearchIn: any[] = [];
  filteredData: any[] = [];
  searchValue?: any;
  PatientInfo: PatientInfo = {
    name: '',
    id: -1,
    gender: '',
    primaryPhone: '',
    secondaryPhone: '',
    knowUsThrough: '',
    note: '',
    debit:0,
    date: '',
    lastReservation: '',
  };
  userType: string | null;

  constructor(
    private reservationsService: ReservationsService,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private loggedIn: AuthService,
    private dialogRef: MatDialog
  ) {
    this.userType = loggedIn.userType;
    //console.log('User Type in Reservation is :>> ', this.userType);
  }
  ngOnInit(): void {
    if (this.userType != 'ROLE_DOCTOR') {
      this.reservationsService.getPatientsNamesAndPhones().subscribe((data: any) => {
        this.allPatientsNamesAndNumbers = data;
         if (Array.isArray(this.allPatientsNamesAndNumbers)) {
          this.AllDataToSearchIn = this.allPatientsNamesAndNumbers;
          this.filteredData = this.AllDataToSearchIn;
          //console.log(this.filteredData);
        if(this.filteredData.length>0){
            this.patientNumber = this.extractPhoneNumberFromSearchResult(
              this.allPatientsNamesAndNumbers[0]
            );
            this.searchValue =  this.allPatientsNamesAndNumbers[0];
            this.patientService.patientInfo(this.patientNumber).subscribe((data)=>{
              this.PatientInfo = data;
              //console.log('info :>> ', this.PatientInfo);
            })
          }
        else
        {
          //console.log('there is no Patients in the system yet');
        }
        }
      });
      this.reservationsService.update$.subscribe((data:any)=>{
        this.AllDataToSearchIn = data;
          this.filteredData = this.AllDataToSearchIn;
        //console.log('Updated array recived : ', this.AllDataToSearchIn);
      })
    }
    else {
      this.route.params.subscribe((params) => {
        this.route.queryParams.subscribe((params) => {
          const phoneNumber = params['phoneNumber'];
          const reservationId = params['id'];
          //console.log('Phone Number Recived :', phoneNumber);
          //console.log('Reservation ID Recived :', reservationId);
          this.patientNumber = phoneNumber;
          this.reservationID = reservationId;
        });
      });
    }
  }


  search() {
    this.patientNumber = this.extractPhoneNumberFromSearchResult(this.searchValue);
    if(this.patientNumber && this.searchValue){
      //console.log('searchValue :>> ', this.searchValue);
    this.reservationsService.updatePhoneNumber(this.patientNumber);
    this.patientService.searchPatients(this.patientNumber).subscribe((data: any) => {
      this.PatientInfo = data;
      //console.log('Searched Patient data: ', this.PatientInfo);
       });
    }

  }

  onChange(value: string): void {
    this.filteredData = this.AllDataToSearchIn.filter(
      (AllDataToSearchIn) =>
        AllDataToSearchIn.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  extractPhoneNumberFromSearchResult(selectedRecord: string): string | null {
    const parts = selectedRecord.split('-');
    if (parts.length === 2) {
      //console.log('Number is Fn.. :>> ', parts[1]);
      return parts[1];
    }
    return null;
  }
  openDialog() {
    this.dialogRef.open(AddNewPatientComponent);
  }

  onTabSelectChange(selectedIndex: number): void {
    let i:number=0;
    if (this.userType === 'ROLE_RECEPTIONIST') {
      switch (selectedIndex) {
        case i:
          this.selectedTab = 'patientInfoTab';
          break;
        case i+1:
          this.selectedTab = 'historyTab';
          break;
        case i+2:
          this.selectedTab = 'packagesTab';
          break;
        case i+3:
          this.selectedTab = 'pointsTab';
          break;
        case i+4:
          this.selectedTab = 'reservationsTab';
          break;
        case i+5:
          this.selectedTab = 'paymentHistoryTab';
          break;
      }
    }
    else if (this.userType === 'ROLE_ADMIN') {
       i=i+1;
       this.selectedTab = 'idlePatientsTab';
    }
    else if(this.userType === 'ROLE_ADMIN'){
      this.selectedTab = 'afterWorkTab';
    }
  }

}

