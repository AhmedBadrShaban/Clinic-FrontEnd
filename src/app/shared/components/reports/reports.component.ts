import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'src/app/modules/admin/services/Reports/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  standalone:true,
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent  implements OnInit{
  newPatients: number;
  Income: number;
  outCome: number;
  pulses: number;
  reservationsNumber: number;
  constructor( private reportService: ReportsService){
    this.reportService.getMonthlyReports().subscribe((data)=>{
      this.newPatients  = data.newPatients;
      this.Income = data.income;
    this.outCome = data.outcome;
    this.pulses = data.pulses;
    this.reservationsNumber = data.reservations;
    })

  }
  ngOnInit(): void {

  }
}
