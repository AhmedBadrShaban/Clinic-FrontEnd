// history.component.ts
import {
  Component, OnDestroy, OnInit, Input, TemplateRef,
  ViewChild, OnChanges, SimpleChanges, ChangeDetectorRef
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { PatientHistory } from "../../../models/patient-history";
import { ReservationsService } from "../../../services/reservations-services/reservations.service";
import { AuthService } from 'src/app/shared/services/auth.service';
import { AfterWorkComponent } from '../after-work/after-work.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit, OnDestroy, OnChanges {
  @Input() phoneNumber: string | null = null;
  @Input() isActive = false;
  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;
  @ViewChild('zeroThirtyTemplate', { static: true }) zeroThirtyTemplate!: TemplateRef<any>;

  private sub = new Subscription();
  private initialized = false;

  tableColumns: Array<{ key: string; label: string; template?: TemplateRef<any> }> = [];
  userType: any;
  dataSource = new MatTableDataSource<PatientHistory>();
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  loadingState = false;

  // ── Filter state ──────────────────────────────────────────
  filterDate: Date | null = null;         // bound to Material datepicker (Date object)
  filterService: string | null = null;    // bound to text input
  activeFilterDate: string | null = null; // YYYY-MM-DD string sent to API + shown in chip
  activeFilterService: string | null = null; // applied chip label

  displayedColumns: string[] = [
    'date', 'service', 'doctorName', 'pulse',
    'fluence1', 'fluence2', 'spot', 'clinic', 'note'
  ];

  constructor(
    private reservationservice: ReservationsService,
    private dialogRef: MatDialog,
    private loggedIn: AuthService,
    private cd: ChangeDetectorRef,
    private datePipe: DatePipe
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
      { key: 'zeroThirty', label: '0/30', template: this.zeroThirtyTemplate },
      { key: 'zimmer', label: 'Zimmer' },
      { key: 'roomName', label: 'Room' },
      { key: 'clinic', label: 'Clinic' },
      { key: 'note', label: 'Note' },
      ...(this.userType === 'ROLE_ADMIN'
        ? [{ key: 'action', label: 'Action', template: this.actionTemplate }]
        : [])
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isActive'] && this.isActive && !this.initialized && this.phoneNumber) {
      this.initialized = true;
      this.getPatientHistory(0);
    }
    if (changes['phoneNumber'] && this.isActive && this.phoneNumber) {
      this.resetFilters(false); // reset filter state silently
      this.getPatientHistory(0);
    }
  }

  // ── Core fetch ────────────────────────────────────────────

  getPatientHistory(page: number): void {
    if (!this.phoneNumber) return;

    this.loadingState = true;
    this.reservationservice
      .getHistory(this.phoneNumber, page, this.pageSize, this.activeFilterDate, this.activeFilterService)
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

  // ── Filter actions ────────────────────────────────────────

  /** Called by the Search button — commits inputs → active chips → fetches page 0 */
  applyFilters(): void {
    // Format Date object → YYYY-MM-DD for the API
    this.activeFilterDate = this.filterDate
      ? this.datePipe.transform(this.filterDate, 'yyyy-MM-dd')
      : null;
    this.activeFilterService = this.filterService?.trim() || null;
    this.currentPage = 0;
    this.getPatientHistory(0);
  }

  /** Remove a single chip */
  removeDateFilter(): void {
    this.filterDate = null;
    this.activeFilterDate = null;
    this.currentPage = 0;
    this.getPatientHistory(0);
  }

  removeServiceFilter(): void {
    this.filterService = null;
    this.activeFilterService = null;
    this.currentPage = 0;
    this.getPatientHistory(0);
  }

  /** Clear everything and reload */
  clearAllFilters(): void {
    this.resetFilters(true);
  }

  get hasActiveFilters(): boolean {
    return !!(this.activeFilterDate || this.activeFilterService);
  }

  private resetFilters(reload: boolean): void {
    this.filterDate = null;        // Date | null
    this.filterService = null;
    this.activeFilterDate = null;
    this.activeFilterService = null;
    this.currentPage = 0;
    if (reload) this.getPatientHistory(0);
  }

  // ── Pagination ────────────────────────────────────────────

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPatientHistory(this.currentPage);
  }

  // ── Dialog ────────────────────────────────────────────────

  openDialog(data: any): void {
    this.dialogRef.open(AfterWorkComponent, { data });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}