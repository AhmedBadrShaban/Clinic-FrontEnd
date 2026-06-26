import { DailySheet, DailySheetStatus } from 'src/app/modules/receptionist/models/daily-sheet';
import { DailysheetService } from './../../services/dailySheet-service/dailysheet.service';
import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DatePipe, NgFor, NgIf, NgClass, DecimalPipe } from '@angular/common';
import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { TableComponent } from '../../shared/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-daily-sheet',
    templateUrl: './daily-sheet.component.html',
    styleUrls: ['./daily-sheet.component.css'],
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, FormsModule, MatAutocompleteModule, MatIconModule, NgFor, MatOptionModule, NgIf, MatDatepickerModule, MatButtonModule, NgClass, TableComponent, DecimalPipe]
})
export class DailySheetComponent implements OnInit {

  // ── Raw lists (full, unfiltered) ─────────────────────────
  allRooms: any[] = [];
  allDoctors: string[] = [];

  // ── Autocomplete filtered lists ──────────────────────────
  filteredRooms: any[] = [];
  filteredDoctors: string[] = [];

  // ── Selected filter values ───────────────────────────────
  selectedRoom: string | null;
  selectedDoctor: string | null;
  selectedDate: any;

  // ── Status panel ─────────────────────────────────────────
  dailySheetStatus: DailySheetStatus | null = null;
  statusLoading = false;

  // ── Table configuration ──────────────────────────────────
  tableColumns: Array<{ key: string; label: string; template?: TemplateRef<any> }> = [];
  dataSource = new MatTableDataSource<DailySheet>();
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  loadingState = false;

  constructor(
    private dailySheetService: DailysheetService,
    private roomsService: RoomsService,
    private datePipe: DatePipe,
    private cd: ChangeDetectorRef
  ) {
    this.selectedDate = new Date();
  }

  ngOnInit(): void {
    this.selectedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');

    // date is the first column, before patientName
    this.tableColumns = [
      { key: 'date', label: 'Date' },        // ← first column
      { key: 'patientName', label: 'Patient' },
      { key: 'paymentType', label: 'Payment Type' },
      { key: 'pulses', label: 'Pulses' },
      { key: 'cash', label: 'Cash' },
      { key: 'vodafoneCash', label: 'Vcash' },
      { key: 'instaPay', label: 'InstaPay' },
      { key: 'visa', label: 'Visa' },
      { key: 'credit', label: 'Credit' },
      { key: 'debit', label: 'Debit' },
      { key: 'totalMoney', label: 'Total' }
    ];

    this.loadDailySheetData(this.currentPage);
    this.loadRooms();
    this.loadDoctors();
  }

  // ── Data loading ─────────────────────────────────────────

  private loadDailySheetData(page: number): void {
    this.loadingState = true;
    this.statusLoading = true;

    this.dailySheetService.filterDailySheet(
      this.selectedRoom,
      this.selectedDate,
      this.selectedDoctor,
      page,
      this.pageSize
    ).subscribe({
      next: (response: any) => {
        this.dataSource.data = [...response.data];
        this.totalItems = response.totalItems;
        this.currentPage = response.currentPage;

        // status lives inside the same response object:
        // { balance: end-start, pulses: actual used, status: balance===pulses }
        this.dailySheetStatus = response.status ?? null;

        this.loadingState = false;
        this.statusLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.loadingState = false;
        this.statusLoading = false;
        console.error('Error loading daily sheet data:', err);
      }
    });
  }

  private loadRooms(): void {
    this.roomsService.getAllRoomsV2().subscribe((rooms) => {
      this.allRooms = rooms;
      this.filteredRooms = [...rooms];
    });
  }

  private loadDoctors(): void {
    this.dailySheetService.getAllDoctorsNames().subscribe((data: any) => {
      this.allDoctors = data;
      this.filteredDoctors = [...data];
    });
  }

  // ── Autocomplete filter handlers ─────────────────────────

  onRoomSearch(value: string): void {
    const lower = (value || '').toLowerCase();
    this.filteredRooms = this.allRooms.filter(r =>
      r.roomName.toLowerCase().includes(lower)
    );
  }

  onDoctorSearch(value: string): void {
    const lower = (value || '').toLowerCase();
    this.filteredDoctors = this.allDoctors.filter(d =>
      d.toLowerCase().includes(lower)
    );
  }

  // ── Filter change handlers ───────────────────────────────

  onRoomChange(): void {
    this.currentPage = 0;
    this.loadDailySheetData(this.currentPage);
  }

  onDoctorChange(): void {
    this.currentPage = 0;
    this.loadDailySheetData(this.currentPage);
  }

  onDateChange(event: any): void {
    this.selectedDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.currentPage = 0;
    this.loadDailySheetData(this.currentPage);
  }

  clearFilter(): void {
    this.selectedDate = null;
    this.selectedRoom = null;
    this.selectedDoctor = null;
    this.currentPage = 0;
    this.filteredRooms = [...this.allRooms];
    this.filteredDoctors = [...this.allDoctors];
    this.dailySheetStatus = null;
    this.loadDailySheetData(this.currentPage);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadDailySheetData(this.currentPage);
  }
}