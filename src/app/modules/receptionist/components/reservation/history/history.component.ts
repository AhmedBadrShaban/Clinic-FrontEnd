import {Component, Input, OnInit} from '@angular/core';
import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize } from 'ng-zorro-antd/table';
import {PatientHistory} from "../../../models/patient-history";
import {ReservationsService} from "../../../services/reservations-services/reservations.service";
import { PatientService } from '../../../services/patient-server/patient.service';

type TableScroll = 'unset' | 'scroll' | 'fixed';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  size: NzTableSize;
  tableScroll: TableScroll;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;
  @Input() history:PatientHistory[]=[];
  @Input() phoneNumber:any;

  @Input() editable : boolean = false;
  constructor(private reservationservice: ReservationsService ) {
    // this.history = reservationservice.getPatientHistory("010");
      this.size= 'small' as NzTableSize,
      this.paginationType= 'default' as NzTablePaginationType,
      this.tableScroll='unset' as TableScroll,
      this.tableLayout='auto' as NzTableLayout,
      this.position= 'bottom' as NzTablePaginationPosition
   }
  ngOnInit(){
    console.log('Recived History phoneNumber :>> ', this.phoneNumber);
    this.reservationservice.phone$.subscribe((data:any) => {
      console.log('Updated History phoneNumber :>> ', data);
      if(data!=0){
        this.phoneNumber = data;
        this.getPatientHistory();
      }
      else{
        this.getPatientHistory();
      }
    });
     }

     getPatientHistory(){
      if(this.phoneNumber){
        this.reservationservice.getHistory(this.phoneNumber).subscribe((data)=>{
          this.history = data;
          console.log(' History :>> ' , this.history );
        })
      }
     }
  openModal(id : string){
    if(this.editable){
      //Open Modal of Edit
      console.log("HII")
    }
  }



}
