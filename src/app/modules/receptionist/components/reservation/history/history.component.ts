import {Component, Input, OnInit} from '@angular/core';
import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize } from 'ng-zorro-antd/table';
import {PatientHistory} from "../../../models/patient-history";
import {ReservationsService} from "../../../services/reservations-services/reservations.service";
import { PatientService } from '../../../services/patient-server/patient.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AfterWorkComponent } from '../after-work/after-work.component';
import { MatDialog } from '@angular/material/dialog';

type TableScroll = 'unset' | 'scroll' | 'fixed';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  userType:any;
  size: NzTableSize;
  tableScroll: TableScroll;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;
  @Input() history:PatientHistory[]=[];
  @Input() phoneNumber:any;
   constructor(private reservationservice: ReservationsService ,private dialogRef : MatDialog ,  private loggedIn:AuthService) {
    // this.history = reservationservice.getPatientHistory("010");
      this.size= 'small' as NzTableSize,
      this.paginationType= 'default' as NzTablePaginationType,
      this.tableScroll='unset' as TableScroll,
      this.tableLayout='auto' as NzTableLayout,
      this.position= 'bottom' as NzTablePaginationPosition
      this.userType = loggedIn.userType;
   }
  ngOnInit(){

    //console.log('Recived History phoneNumber :>> ', this.phoneNumber);
    this.reservationservice.phone$.subscribe((data:any) => {
      //console.log('Updated History phoneNumber :>> ', data);
      if(data!=0){
        this.phoneNumber = data;
        this.getPatientHistory();
      }
      else{
        this.getPatientHistory();
      }
    });
    this.reservationservice.updateHistory$.subscribe((data:any)=>{
      //console.log('Updated History :>> ', data);
      this.history = data;
    });
 }

     getPatientHistory(){
      if(this.phoneNumber){
        this.reservationservice.getHistory(this.phoneNumber).subscribe((data)=>{
          this.history = data;
          //console.log(' History :>> ' , this.history );
        })
      }
     }
     openDialog(dataa:any){
      this.dialogRef.open(AfterWorkComponent , {
        data:dataa,
      })
      // //console.log("sended data is : " , dataa )
    }
  }
