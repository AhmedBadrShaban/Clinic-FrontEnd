import { Component, Input, OnInit } from '@angular/core';
import { NzTableSize, NzTableLayout, NzTablePaginationPosition, NzTablePaginationType } from 'ng-zorro-antd/table';
import { DailySheet } from 'src/app/modules/receptionist/models/daily-sheet';
import { ReservationsService } from '../../../services/reservations-services/reservations.service';
interface Setting {
  bordered: boolean;
  loading: boolean;
  pagination: boolean;
  sizeChanger: boolean;
  title: boolean;
  header: boolean;
  footer: boolean;
  expandable: boolean;
  checkbox: boolean;
  fixHeader: boolean;
  noResult: boolean;
  ellipsis: boolean;
  simple: boolean;
  size: NzTableSize;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;
 }


@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {
 paymentHistory:DailySheet[];
  @Input() phoneNumber:any;

  settingValue: Setting;
  constructor(private reservationsService :ReservationsService){
    //console.log('payment History ini :>> ' );
    this.settingValue ={
      bordered: true,
      loading: false,
      pagination: true,
      sizeChanger: true,
      title: false,
      header: true,
      footer: false,
      expandable: false,
      checkbox: false,
      fixHeader: false,
      noResult: false,
      ellipsis: false,
      simple: false,
      size: 'small' as NzTableSize,
      paginationType: 'default' as NzTablePaginationType,
      tableLayout: 'auto' as NzTableLayout,
      position: 'bottom' as NzTablePaginationPosition
    };
  }
  ngOnInit(): void {
    //console.log('Recived paymentHistory phoneNumber :>> ', this.phoneNumber);
    this.reservationsService.phone$.subscribe((data:any) => {
      //console.log('Updated  Reservations History phoneNumber :>> ', data);
      if(data!=0 && this.phoneNumber){
        this.phoneNumber = data;
        this.getPaymentHistory();
      }
      else if(this.phoneNumber){
        this.getPaymentHistory();
      }

    });

  }

  getPaymentHistory(){
    //console.log('phone Before API :>> ', this.phoneNumber);
    if(this.phoneNumber){
    this.reservationsService.getPaymentHistory(this.phoneNumber).subscribe((data)=>{
      this.paymentHistory =data;
      //console.log('recived paymentHistory  :>> ',  this.paymentHistory);
     })
    }
    }


}
