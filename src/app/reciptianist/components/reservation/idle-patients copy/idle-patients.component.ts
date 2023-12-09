import { Component, OnInit } from '@angular/core';
import {ReservationsService} from "../../../../reciptianist/services/reservations-services/reservations.service";
import {IdlePatients} from "../../../../reciptianist/models/idle-patients";
import {NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize} from "ng-zorro-antd/table";
import { PatientService } from 'src/app/reciptianist/services/patient-server/patient.service';

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
