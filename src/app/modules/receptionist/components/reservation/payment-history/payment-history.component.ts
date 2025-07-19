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

  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;

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
    this.reservationsService.phone$.subscribe((data: any) => {
      if (data != 0 && this.phoneNumber) {
        this.phoneNumber = data;
        this.getPaymentHistory(this.currentPage);
      } else if (this.phoneNumber) {
        this.getPaymentHistory(this.currentPage);
      }
    });
  }

  getPaymentHistory(page: number): void {
    if (this.phoneNumber) {
      const zeroBasedPage = page - 1;
      this.reservationsService.getPaymentHistory(this.phoneNumber, zeroBasedPage, this.pageSize).subscribe((data) => {
        this.paymentHistory = data.data;
        this.totalItems = data.totalItems;
        this.currentPage = page;
      });
    }
  }
  onPaymentPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.getPaymentHistory(this.currentPage);
  }


}
