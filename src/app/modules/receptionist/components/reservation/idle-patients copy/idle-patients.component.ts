import { IdlePatients } from '../../../../receptionist/models/idle-patients';
import { Component, OnInit } from '@angular/core';
 import {NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize} from "ng-zorro-antd/table";
import { PatientService } from 'src/app/modules/receptionist/services/patient-server/patient.service';
import { ReservationsService } from 'src/app/modules/receptionist/services/reservations-services/reservations.service';

@Component({
  selector: 'app-idle-patients',
  templateUrl: './idle-patients.component.html',
  styleUrls: ['./idle-patients.component.css']
})
export class IdlePatientsComponent implements OnInit {
  idlePatients: IdlePatients[] = [];
  totalIdlePatients = 0;
  pageSize = 5;
  pageIndex = 1;
  loading = false;

  size: NzTableSize = 'small';
  tableLayout: NzTableLayout = 'auto';
  position: NzTablePaginationPosition = 'bottom';
  paginationType: NzTablePaginationType = 'default';

  constructor(private patientService: PatientService) { }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.patientService.getAllIdlePatients(this.pageIndex - 1, this.pageSize).subscribe({
      next: (data: any) => {
        this.idlePatients = data.content;  
        this.totalIdlePatients = data.totalElements;  
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onPageChange(newPage: number): void {
    this.pageIndex = newPage;
    this.loadPatients();
  }
}

