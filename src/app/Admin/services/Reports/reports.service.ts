import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor() { }

  getNumberOfPatientLastMonth(){
    return 250;
  }
  getIncomeOfLastMonth(){
    return 30000;
  }

  getOutComeOfMonth(){
    return 5000;
  }

  getPulsesOfMonth(){
    return 723;
  }

  getReservationsOfMonth(){
    return 1403;
  }
}
