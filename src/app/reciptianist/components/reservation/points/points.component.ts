import { Component, Input, OnInit } from '@angular/core';
import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize } from 'ng-zorro-antd/table';
import {PatientPoints} from "../../../models/patient-points";
import {ReservationsService} from "../../../services/reservations-services/reservations.service";

type TableScroll = 'unset' | 'scroll' | 'fixed';

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.css']
})
export class PointsComponent implements OnInit {
  @Input() totalIn:number=-1;
  @Input() totalOut:number=-1;
  @Input() pointsHistory:PatientPoints[]=[];

  size: NzTableSize;
  tableScroll: TableScroll;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;

  constructor(private reservationsService : ReservationsService){
     this.size= 'small' as NzTableSize,
      this.paginationType= 'default' as NzTablePaginationType,
      this.tableScroll='unset' as TableScroll,
      this.tableLayout='auto' as NzTableLayout,
      this.position= 'bottom' as NzTablePaginationPosition
  }
ngOnInit(){
 

    
}
 
  openModal(){}


}
