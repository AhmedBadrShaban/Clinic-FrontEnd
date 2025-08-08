// history.component.ts
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PatientHistory } from "../../../models/patient-history";
import { ReservationsService } from "../../../services/reservations-services/reservations.service";
import { AuthService } from 'src/app/shared/services/auth.service';
import { AfterWorkComponent } from '../after-work/after-work.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit, OnDestroy {
   @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;

  phoneNumber: string | null = null;
  private sub = new Subscription();

  tableColumns: Array<{ key: string, label: string, template?: TemplateRef<any> }> = []; 
  userType: any;
  dataSource = new MatTableDataSource<PatientHistory>();
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  loadingState=false;

   displayedColumns: string[] = [
    'date',
    'service',
    'doctorName',
    'pulse',
    'fluence1',
    'fluence2',
    'spot',
    'clinic',
    'note'
  ];



  constructor(
    private reservationservice: ReservationsService,
    private dialogRef: MatDialog,
    private loggedIn: AuthService,
   ) {
    this.userType = loggedIn.userType;

     if (this.userType === 'ROLE_ADMIN') {
      this.displayedColumns.push('action');
    }
  }

  ngOnInit(): void {
    this.tableColumns = [
      { key: 'date', label: 'Date' },
      { key: 'service', label: 'Treatment Area' },
      { key: 'doctorName', label: 'Doctor' },
      { key: 'pulse', label: 'Pulses' },
      { key: 'fluence1', label: 'Fluence 1' },
      { key: 'fluence2', label: 'Fluence 2' },
      { key: 'spot', label: 'Spot' },
      { key: 'clinic', label: 'Clinic' },
      { key: 'note', label: 'Note' },
      ...(this.userType === 'ROLE_ADMIN' ? [{ key: 'action', label: 'Action', template: this.actionTemplate }] : [])
    ];
    this.sub.add(
      this.reservationservice.phone$.subscribe(phone => {
        this.phoneNumber = phone;
        if (this.phoneNumber) {
          this.getPatientHistory(this.currentPage);
        }
      })
    );
  }

  getPatientHistory(page: number): void {
    if (this.phoneNumber) {
       console.log('calling history of patient', this.phoneNumber);
      console.log('page , size', page, this.pageSize);
      this.reservationservice.getHistory(this.phoneNumber, page, this.pageSize)
        .subscribe((res: any) => {
          console.log('res', res);
          this.dataSource.data = [...res.data];
           console.log('history received', this.dataSource.data);
          this.totalItems = res.totalItems;
        });
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPatientHistory(this.currentPage);
  }

  openDialog(data: any): void {
    this.dialogRef.open(AfterWorkComponent, {
      data: data,
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}