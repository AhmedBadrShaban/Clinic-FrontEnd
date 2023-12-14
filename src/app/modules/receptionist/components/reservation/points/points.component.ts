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
  @Input() totalIn:number=-1;
  @Input() totalOut:number=-1;
  @Input() patientNumber:string;
  @Input() pointsHistory:PatientPoints[]=[];

  size: NzTableSize;
  tableScroll: TableScroll;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;

  constructor(private reservationsService : ReservationsService , private dialogRef : MatDialog , private patientService:PatientService ){
     this.size= 'small' as NzTableSize,
      this.paginationType= 'default' as NzTablePaginationType,
      this.tableScroll='unset' as TableScroll,
      this.tableLayout='auto' as NzTableLayout,
      this.position= 'bottom' as NzTablePaginationPosition
  }
ngOnInit(){
  this.patientService.listOfData$.subscribe((data:any) => {
    this.pointsHistory = data;
  });
  this.patientService.out$.subscribe((data:any) => {
    console.log('object :>> ', data);
    this.totalOut += data;
  });
 }

  openModal(){
    this.dialogRef.open(SendPointsComponent , {data:this.patientNumber});
  }


}
