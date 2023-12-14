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
  size: NzTableSize;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;
  idlePatients: IdlePatients[] =[];
  constructor(private patientService:PatientService, ) {
    this.size= 'small' as NzTableSize,
        this.paginationType= 'default' as NzTablePaginationType,
        this.tableLayout='auto' as NzTableLayout,
        this.position= 'bottom' as NzTablePaginationPosition
   }
  ngOnInit(): void {
    this.patientService.getAllIdlePatients().subscribe((data:any)=>{
      this.idlePatients =data;
    })
  }
}
