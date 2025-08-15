import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
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
export class PointsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() phoneNumber: string | null = null;
  @Input() isActive = false; 
  @ViewChild('noteTemplate', { static: true }) noteTemplate!: TemplateRef<any>;

  private sub = new Subscription();
  private initialized = false;  

  remain: number = 0;
  totalOut: number = 0;
  totalIn: number = 0;

  tableColumns: Array<{ key: string, label: string, template?: TemplateRef<any> }> = [];
  dataSource = new MatTableDataSource<PatientPoints>();
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  loadingState = false;

  constructor(
    private reservationsService: ReservationsService,
    private patientService: PatientService,
    private dialogRef: MatDialog,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.tableColumns = [
      { key: 'point_in', label: 'Current' },
      { key: 'point_out', label: 'Used' },
      { key: 'date', label: 'Date' },
      { key: 'note', label: 'Notes', template: this.noteTemplate }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Tab just became active and hasn't loaded yet
    if (changes['isActive'] && this.isActive && !this.initialized && this.phoneNumber) {
      this.initialized = true;
      this.loadPointsData();
    }

    // Phone number changed while tab is active
    if (changes['phoneNumber'] && this.isActive && this.phoneNumber) {
      this.loadPointsData();
    }
  }

  private loadPointsData(): void {
    this.getPointsHistory(this.currentPage);
    this.getTotalInAndOut();
  }

  getPointsHistory(page: number): void {
    if (!this.phoneNumber) return;
    this.loadingState = true;

    this.reservationsService.getPointsHistory(this.phoneNumber, page, this.pageSize)
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

  getTotalInAndOut(): void {
    if (!this.phoneNumber) return;

    this.reservationsService.getPatientByNumber(this.phoneNumber)
      .subscribe((data) => {
        this.totalIn = data.total_points_in;
        this.totalOut = data.total_points_out;
        this.remain = data.remain;
        this.cd.detectChanges();

      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPointsHistory(this.currentPage);
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
