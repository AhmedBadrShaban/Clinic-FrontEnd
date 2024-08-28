import { Component, Input, OnInit } from '@angular/core';
import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize } from 'ng-zorro-antd/table';
import {PatientPoints} from "../../../models/patient-points";
import { MatDialog } from '@angular/material/dialog';
import {ReservationsService} from "../../../services/reservations-services/reservations.service";
import { SendPointsComponent } from './send-points/send-points.component';
import { PatientService } from '../../../services/patient-server/patient.service';
type TableScroll = 'unset' | 'scroll' | 'fixed';

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.css']
})
export class PointsComponent implements OnInit {
  @Input() phoneNumber:any;
  remain:number=0;
  totalOut:number=0
  totalIn:number=0;
  pointsHistory:PatientPoints[]=[];
  size: NzTableSize;
  tableScroll: TableScroll;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;

  constructor(private reservationsService : ReservationsService ,  private patientService:PatientService ,  private dialogRef : MatDialog  ){
     this.size= 'small' as NzTableSize,
      this.paginationType= 'default' as NzTablePaginationType,
      this.tableScroll='unset' as TableScroll,
      this.tableLayout='auto' as NzTableLayout,
      this.position= 'bottom' as NzTablePaginationPosition
  }
ngOnInit(){
  //console.log('points History ini :>> ' );
  //console.log('Recived points History  phoneNumber :>> ', this.phoneNumber);
   this.reservationsService.phone$.subscribe((data:any) => {
    //console.log('Updated  points History phoneNumber :>> ', data);
    if(data!=0 && this.phoneNumber){
      this.phoneNumber = data;
      this.getPointsHistory();
    }
    else if(this.phoneNumber){
      this.getPointsHistory();
    }
  });
  this.patientService.historyObservable$.subscribe((data)=>{
    //console.log('data historyObservable :>> ', data);
    this.pointsHistory = data
    this.getTotalInAndOut()
  })

   // this.patientService.listOfData$.subscribe((data:any) => {
  //   this.pointsHistory = data;
  // });
  // this.patientService.out$.subscribe((data:any) => {
  //   //console.log('object :>> ', data);
  //   this.totalOut += data;
  // });
 }

 getPointsHistory(){
  //console.log('phone Before API :>> ', this.phoneNumber);
  if(this.phoneNumber){
  this.reservationsService.getPointsHistory(this.phoneNumber).subscribe((data)=>{
    this.pointsHistory =data;
    //console.log('recived Points History :>> ',  this.pointsHistory);
    this.getTotalInAndOut();
  })
  }
  }
  getTotalInAndOut(){
    if(this.phoneNumber){
    this.reservationsService.getPatientByNumber(this.phoneNumber).subscribe((data)=>{
      this.totalIn =data.total_points_in;
      this.totalOut =data.total_points_out;
      this.remain =data.remain;
     })
    }
    }

  openModal(){
    if(this.phoneNumber){
    this.dialogRef.open(SendPointsComponent , {data:this.phoneNumber});
    }
  }


}
