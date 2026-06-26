import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
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
export class PaymentHistoryComponent implements OnInit, OnDestroy, OnChanges {
  @Input() phoneNumber: string | null = null;
  @Input() isActive = false; // NEW for lazy loading

  tableColumns: Array<{ key: string, label: string, template?: any }> = [];
  dataSource = new MatTableDataSource<DailySheet>();
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  private sub = new Subscription();
  private initialized = false; // NEW to track first load
  loadingState = false; // NEW spinner flag

  constructor(private reservationsService: ReservationsService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.tableColumns = [
      { key: 'date', label: 'Date' },
      { key: 'patientName', label: 'Patient' },
      { key: 'roomName', label: 'Room' },
      { key: 'doctorName', label: 'Doctor' },
      { key: 'paymentType', label: 'Payment Type / Service' },
      { key: 'pulses', label: 'Pulses' },
      { key: 'cash', label: 'Cash' },
      { key: 'vodafoneCash', label: 'Vcash' },
      { key: 'visa', label: 'Visa' },
      { key: 'instaPay', label: 'InstaPay' },
      { key: 'credit', label: 'Credit' },
      { key: 'debit', label: 'Debit' },
      { key: 'totalMoney', label: 'Total' }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    // First time tab is opened
    if (changes['isActive'] && this.isActive && !this.initialized && this.phoneNumber) {
      this.initialized = true;
      this.getPaymentHistory(this.currentPage);
    }

    // Phone number changed while tab is already active
    if (changes['phoneNumber'] && this.isActive && this.phoneNumber) {
      this.getPaymentHistory(this.currentPage);
    }
  }

  getPaymentHistory(page: number): void {
    if (!this.phoneNumber) return;
    this.loadingState = true;

    this.reservationsService.getPaymentHistory(this.phoneNumber, page, this.pageSize)
      .subscribe({
        next: (data) => {
          this.dataSource.data = [...data.data];
          this.totalItems = data.totalItems;
          this.cd.detectChanges();
          this.loadingState = false;
        },
        error: () => {
          this.loadingState = false;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPaymentHistory(this.currentPage);
  }
handleSort(event: { column: string; direction: string }) {
  //  this.loadData(event.column, event.direction);
}
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
