// history.component.ts
import { Component, OnDestroy, OnInit, Input, TemplateRef, ViewChild, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
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
export class HistoryComponent implements OnInit, OnDestroy, OnChanges {
  @Input() phoneNumber: string | null = null;
  @Input() isActive = false; // NEW: tab active state
  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;

  private sub = new Subscription();
  private initialized = false; // NEW: ensure we only load once

  tableColumns: Array<{ key: string, label: string, template?: TemplateRef<any> }> = [];
  userType: any;
  dataSource = new MatTableDataSource<PatientHistory>();
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  loadingState = false;

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
    private cd: ChangeDetectorRef
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
      { key: 'roomName', label: 'Room' },
      { key: 'clinic', label: 'Clinic' },
      { key: 'note', label: 'Note' },
      ...(this.userType === 'ROLE_ADMIN' ? [{ key: 'action', label: 'Action', template: this.actionTemplate }] : [])
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isActive'] && this.isActive && !this.initialized && this.phoneNumber) {
      this.initialized = true;
      this.getPatientHistory(this.currentPage);
    }

    // If phoneNumber changes while active
    if (changes['phoneNumber'] && this.isActive && this.phoneNumber) {
      this.getPatientHistory(this.currentPage);
    }
  }

  getPatientHistory(page: number): void {
    if (!this.phoneNumber) return;

    this.loadingState = true;
    this.reservationservice.getHistory(this.phoneNumber, page, this.pageSize)
      .subscribe({
        next: (res: any) => {
          this.dataSource.data = [...res.data];
          this.totalItems = res.totalItems;
          this.loadingState = false;
          this.cd.detectChanges();

        },
        error: () => {
          this.loadingState = false;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPatientHistory(this.currentPage);
  }

  openDialog(data: any): void {
    this.dialogRef.open(AfterWorkComponent, { data });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
