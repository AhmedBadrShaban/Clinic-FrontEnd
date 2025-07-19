// idle-patients.component.ts
import { IdlePatients } from '../../../../receptionist/models/idle-patients';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { PatientService } from 'src/app/modules/receptionist/services/patient-server/patient.service';

@Component({
  selector: 'app-idle-patients',
  templateUrl: './idle-patients.component.html',
  styleUrls: ['./idle-patients.component.css']
})
export class IdlePatientsComponent implements OnInit {
  tableColumns: Array<{ key: string, label: string, template?: any }> = [];
  dataSource = new MatTableDataSource<IdlePatients>();
  totalItems: number = 0;
  pageSize: number = 5;
  currentPage: number = 0; // Changed to 0-based indexing to match Material table
  pageSizeOptions: number[] = [5, 10, 25, 50];
  loading = false;

  constructor(private patientService: PatientService) { }

  ngOnInit(): void {
    // Define table columns for idle patients
    this.tableColumns = [
      { key: 'patientName', label: 'Patient Name' },
      { key: 'joinedAt', label: 'Joined At' },
      { key: 'primaryPhone', label: 'Phone Number' }
    ];

    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.patientService.getAllIdlePatients(this.currentPage, this.pageSize).subscribe({
      next: (data: any) => {
        this.dataSource.data = [...data.data];
        this.totalItems = data.totalItems;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPatients();
  }
}