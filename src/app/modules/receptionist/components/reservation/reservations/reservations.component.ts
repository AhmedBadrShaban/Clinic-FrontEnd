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
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;

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
        this.getReservations(this.currentPage);
      }
      else if(this.phoneNumber){
        this.getReservations(this.currentPage);
      }

    });

    }

  getReservations(page: number){
    //console.log('phone Before API :>> ', this.phoneNumber);
    if(this.phoneNumber){
      const zeroBasedPage = page - 1;
      console.log('page , size', page - 1, this.pageSize)
      this.reservationsService.getReservationsHistory(this.phoneNumber, zeroBasedPage, this.pageSize).subscribe((data)=>{
        this.reservations = [...data.data];
        console.log('packages recived', this.reservations)
        this.totalItems = data.totalItems;
        this.currentPage = this.currentPage + 1;      
          //console.log('recived Reservations History :>> ',  this.reservations);
     })
    }
    }
  onReservationsPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.getReservations(this.currentPage);
  }

}
