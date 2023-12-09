import { Component } from '@angular/core';
import {ReportsService} from "../../services/Reports/reports.service";

@Component({
  selector: 'app-reports-summary',
  templateUrl: './reports-summary.component.html',
  styleUrls: ['./reports-summary.component.css']
})
export class ReportsSummaryComponent {
  newPatients: number;
  Income: number;
  outCome: number;
  pulses: number;
  reservationsNumber: number;

  constructor(private reportService: ReportsService) {
    this.newPatients = reportService.getNumberOfPatientLastMonth();
    this.Income = reportService.getIncomeOfLastMonth();
    this.outCome = reportService.getOutComeOfMonth();
    this.pulses = reportService.getPulsesOfMonth();
    this.reservationsNumber = reportService.getReservationsOfMonth()
  }
}
