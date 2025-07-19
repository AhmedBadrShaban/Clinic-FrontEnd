// payment-history.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { DailySheet } from 'src/app/modules/receptionist/models/daily-sheet';
import { ReservationsService } from '../../../services/reservations-services/reservations.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit, OnDestroy {
  @Input() phoneNumber: any;

  private sub = new Subscription();
  tableColumns: Array<{ key: string, label: string, template?: any }> = [];
  dataSource = new MatTableDataSource<DailySheet>();
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 0; // Changed to 0-based indexing to match Material table
  pageSizeOptions: number[] = [5, 10, 25, 50];

  constructor(private reservationsService: ReservationsService) { }

  ngOnInit(): void {
    // Define table columns for payment history
    this.tableColumns = [
      { key: 'patientName', label: 'Patient' },
      { key: 'paymentType', label: 'Payment Type' },
      { key: 'service', label: 'Service' },
      { key: 'pulses', label: 'Pulses' },
      { key: 'cash', label: 'Cash' },
      { key: 'vodafoneCash', label: 'Vcash' },
      { key: 'visa', label: 'Visa' },
      { key: 'credit', label: 'Credit' },
      { key: 'instaPay', label: 'InstaPay' },
      { key: 'debit', label: 'Debit' },
      { key: 'totalMoney', label: 'Total' }
    ];

     this.sub.add(
      this.reservationsService.phone$.subscribe((data: any) => {
        this.phoneNumber = data;
        console.log('phone Recived', this.phoneNumber)
        if (this.phoneNumber) {
          this.getPaymentHistory(this.currentPage);
        }
      })
    );
  }

  getPaymentHistory(page: number): void {
    if (this.phoneNumber) {
      console.log('page, size', page, this.pageSize);
      this.reservationsService.getPaymentHistory(this.phoneNumber, page, this.pageSize)
        .subscribe((data) => {
          this.dataSource.data = [...data.data];
          console.log('payment history received', this.dataSource.data);
          this.totalItems = data.totalItems;
        });
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPaymentHistory(this.currentPage);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}