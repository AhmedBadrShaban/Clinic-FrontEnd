import { Component, Input, OnInit } from '@angular/core';
import {
  NzTableLayout,
  NzTablePaginationPosition,
  NzTablePaginationType,
  NzTableSize
} from 'ng-zorro-antd/table';
import { PatientHistory } from "../../../models/patient-history";
import { ReservationsService } from "../../../services/reservations-services/reservations.service";
import { AuthService } from 'src/app/shared/services/auth.service';
import { AfterWorkComponent } from '../after-work/after-work.component';
import { MatDialog } from '@angular/material/dialog';

type TableScroll = 'unset' | 'scroll' | 'fixed';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  userType: any;
  size: NzTableSize;
  tableScroll: TableScroll;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;

  history: PatientHistory[] = [];
  totalItems: number = 0;
  pageSize: number = 5;
  currentPage: number = 1;

  @Input() phoneNumber: any;

  constructor(
    private reservationservice: ReservationsService,
    private dialogRef: MatDialog,
    private loggedIn: AuthService
  ) {
    this.size = 'small' as NzTableSize;
    this.paginationType = 'default' as NzTablePaginationType;
    this.tableScroll = 'unset' as TableScroll;
    this.tableLayout = 'auto' as NzTableLayout;
    this.position = 'bottom' as NzTablePaginationPosition;
    this.userType = loggedIn.userType;
  }

  ngOnInit(): void {
    this.reservationservice.phone$.subscribe((data: any) => {
      if (data != 0) {
        this.phoneNumber = data;
        this.getPatientHistory(this.currentPage);
      } else {
        this.getPatientHistory(this.currentPage);
      }
    });

    this.reservationservice.updateHistory$.subscribe((data: any) => {
      this.history = data;
    });
  }

  getPatientHistory(page: number): void {
    if (this.phoneNumber) {
      console.log('calling history of patient ', this.phoneNumber )
      const zeroBasedPage = page - 1;
      console.log('page , size', page-1 , this.pageSize)
      this.reservationservice.getHistory(this.phoneNumber, zeroBasedPage, this.pageSize)
        .subscribe((res: any) => {
          console.log('res', res)
          this.history = [...res.data]; 
          console.log('history recived' , this.history)
          this.totalItems =res.totalItems;
          this.currentPage = this.currentPage + 1;  
        
        });
    }
  }

  onPageChange(newPage: number): void {
    this.getPatientHistory(newPage);
  }

  openDialog(dataa: any): void {
    this.dialogRef.open(AfterWorkComponent, {
      data: dataa,
    });
  }
}
