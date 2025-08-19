import { DailySheet, DailySheetStatus } from 'src/app/modules/receptionist/models/daily-sheet';
import { DailysheetService } from './../../services/dailySheet-service/dailysheet.service';
import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-daily-sheet',
  templateUrl: './daily-sheet.component.html',
  styleUrls: ['./daily-sheet.component.css']
})
export class DailySheetComponent implements OnInit {
  allRooms: any[];
  allDoctors: string[];
  selectedRoom: string;
  selectedDoctor: any;
  selectedDate: any;
  dailySheetStatus: DailySheetStatus;

  // Table configuration similar to history component
  tableColumns: Array<{ key: string, label: string, template?: TemplateRef<any> }> = [];
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

    // Initialize table columns
    this.tableColumns = [
      { key: 'patientName', label: 'Patient' },
      { key: 'paymentType', label: 'Payment Type' },
      { key: 'service', label: 'What She Will Do' },
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

  private loadDailySheetData(page: number): void {
    this.loadingState = true;

    this.dailySheetService.filterDailySheet(
      this.selectedRoom,
      this.selectedDate,
      this.selectedDoctor,
      page,
      this.pageSize
    ).subscribe((response: any) => {
      // Handle the new response format
      this.dataSource.data = [...response.data];
      this.totalItems = response.totalItems;
      this.currentPage = response.currentPage;
      this.loadingState = false;
      this.cd.detectChanges();
      console.log("daily sheet received: ", this.dataSource.data);
      console.log("total items: ", this.totalItems);
    }, error => {
      this.loadingState = false;
      console.error('Error loading daily sheet data:', error);
    });
  }

  private loadRooms(): void {
    this.roomsService.getAllRoomsV2().subscribe((rooms) => {
      this.allRooms = rooms;
      console.log('rooms :>> ', this.allRooms);
    });
  }

  private loadDoctors(): void {
    this.dailySheetService.getAllDoctorsNames().subscribe((data: any) => {
      this.allDoctors = data;
      console.log('AllNames of Doctors:>> ', this.allDoctors);
    });
  }

  onRoomChange(): void {
    console.log("selected room before filtering is: ", this.selectedRoom);
    this.currentPage = 0; // Reset to first page on filter change
    this.loadDailySheetData(this.currentPage);
  }

  onDoctorChange(): void {
    console.log("selected Doctor before filtering is: ", this.selectedDoctor);
    this.currentPage = 0; // Reset to first page on filter change
    this.loadDailySheetData(this.currentPage);
  }

  onDateChange(event: any): void {
    const formattedDate = event.value;
    this.selectedDate = this.datePipe.transform(formattedDate, 'yyyy-MM-dd');
    console.log("selected Date before filtering is: ", this.selectedDate);
    this.currentPage = 0; // Reset to first page on filter change
    this.loadDailySheetData(this.currentPage);
  }

  clearFilter(): void {
    console.log('Clearing Filters');

    // Reset the filters
    this.selectedDate = null;
    this.selectedRoom = "Room";
    this.selectedDoctor = null;
    this.currentPage = 0;

    this.loadDailySheetData(this.currentPage);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadDailySheetData(this.currentPage);
  }
}