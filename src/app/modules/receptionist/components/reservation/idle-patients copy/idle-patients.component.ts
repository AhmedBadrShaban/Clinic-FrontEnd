import { IdlePatients } from '../../../../receptionist/models/idle-patients';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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
  totalItems = 0;
  pageSize = 5;
  currentPage = 0; // 0-based indexing for Material
  pageSizeOptions = [5, 10, 25, 50];
  loading = false;
  @Input() isActive: boolean = false;


  constructor(private patientService: PatientService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
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
        // Lazy load: we replace data with only the page results
        this.dataSource.data = data.data ?? [];
        this.totalItems = data.totalItems ?? 0;
        this.loading = false;
        this.cd.detectChanges();

      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    if (event.pageIndex !== this.currentPage || event.pageSize !== this.pageSize) {
      this.currentPage = event.pageIndex;
      this.pageSize = event.pageSize;
      this.loadPatients();
    }
  }
}
