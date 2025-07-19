// points.component.ts
import { Component, Input, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { PatientPoints } from "../../../models/patient-points";
import { MatDialog } from '@angular/material/dialog';
import { ReservationsService } from "../../../services/reservations-services/reservations.service";
import { SendPointsComponent } from './send-points/send-points.component';
import { PatientService } from '../../../services/patient-server/patient.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.css']
})
export class PointsComponent implements OnInit, OnDestroy {
  @Input() phoneNumber: any;
  @ViewChild('noteTemplate', { static: true }) noteTemplate!: TemplateRef<any>;

  private sub = new Subscription();
  remain: number = 0;
  totalOut: number = 0;
  totalIn: number = 0;

  tableColumns: Array<{ key: string, label: string, template?: TemplateRef<any> }> = [];
  dataSource = new MatTableDataSource<PatientPoints>();
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  constructor(
    private reservationsService: ReservationsService,
    private patientService: PatientService,
    private dialogRef: MatDialog
  ) { }

  ngOnInit(): void {
    // Define table columns including custom template for notes
    this.tableColumns = [
      { key: 'point_in', label: 'Current' },
      { key: 'point_out', label: 'Used' },
      { key: 'date', label: 'Date' },
      { key: 'note', label: 'Notes', template: this.noteTemplate }
    ];

    // Subscribe to phone number changes
    this.sub.add(
      this.reservationsService.phone$.subscribe((data: any) => {
        this.phoneNumber = data;
        if (this.phoneNumber) {
          this.getPointsHistory();
          this.getTotalInAndOut();
}
      })
    );
  }

  getPointsHistory(): void {
   
      this.reservationsService.getPointsHistory(this.phoneNumber).subscribe((data) => {
        this.dataSource.data = [...data];
        this.totalItems = data.length;
        this.getTotalInAndOut();
      });
  }

  getTotalInAndOut(): void {
    if (this.phoneNumber) {
      this.reservationsService.getPatientByNumber(this.phoneNumber).subscribe((data) => {
        console.log('patient:- ', data)
        this.totalIn = data.total_points_in;
        this.totalOut = data.total_points_out;
        this.remain = data.remain;
        
      });
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
   }

  openModal(): void {
    if (this.phoneNumber) {
      this.dialogRef.open(SendPointsComponent, { data: this.phoneNumber });
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}