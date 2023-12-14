import { Component } from '@angular/core';
import {Router} from "@angular/router";
import { ReportsService } from '../../services/Reports/reports.service';
 
 @Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent {
    pages = [
        'rooms',
        'patients',
        'doctors',
        'receptionists',
        'services',
        'admin-package',
        'materials',
        'reservations',
        'expense',
        'reports'
    ]
    newPatients: number;
    Income: number;
    outCome: number;
    pulses: number;
    reservationsNumber: number;
  
    constructor(private router: Router , private reportService: ReportsService) {
      this.newPatients = reportService.getNumberOfPatientLastMonth();
      this.Income = reportService.getIncomeOfLastMonth();
      this.outCome = reportService.getOutComeOfMonth();
      this.pulses = reportService.getPulsesOfMonth();
      this.reservationsNumber = reportService.getReservationsOfMonth()
    }
  GoTo(id: number){
    this.router.navigate([ 'admin', this.pages[id]])
  }
}
