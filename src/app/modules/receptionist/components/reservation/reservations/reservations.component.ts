import { Component, Input, OnInit } from '@angular/core';
import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize } from 'ng-zorro-antd/table';
import { ReservationsService } from '../../../services/reservations-services/reservations.service';

type TableScroll = 'unset' | 'scroll' | 'fixed';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit  {
  size: NzTableSize;
  tableScroll: TableScroll;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;
 reservations:any[];
  @Input() phoneNumber:any;


  constructor(private reservationsService:ReservationsService) {

      this.size= 'small' as NzTableSize,
      this.paginationType= 'default' as NzTablePaginationType,
      this.tableScroll='unset' as TableScroll,
      this.tableLayout='auto' as NzTableLayout,
      this.position= 'bottom' as NzTablePaginationPosition
   }
  ngOnInit(){
    //console.log('rservations History ini :>> ' );
    //console.log('Recived rservations History  phoneNumber :>> ', this.phoneNumber);
    this.reservationsService.phone$.subscribe((data:any) => {
      //console.log('Updated  Reservations History phoneNumber :>> ', data);
      if(data!=0 && this.phoneNumber){
        this.phoneNumber = data;
        this.getReservations();
      }
      else if(this.phoneNumber){
        this.getReservations();
      }

    });

    }

   getReservations(){
    //console.log('phone Before API :>> ', this.phoneNumber);
    if(this.phoneNumber){
    this.reservationsService.getReservationsHistory(this.phoneNumber).subscribe((data)=>{
      this.reservations =data;
      //console.log('recived Reservations History :>> ',  this.reservations);
     })
    }
    }




}
