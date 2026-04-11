// reports.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';

export interface MonthlyReportRequest {
  month: number;
  year: number;
  roomName?: string;
}

export interface MonthlyReportResponse {
  totalMoney: number;
  month: number;
  year: number;
  roomName?: string;
  transactions: any[];
  summary: {
    servicesIncome: number;
    packagesIncome: number;
    totalTransactions: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private readonly baseUrl;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = this.configService.getBaseUrl();
  }

  getMonthlyReports(month?: number, year?: number, clinic?: string): Observable<any> {
    let params = new HttpParams();

    if (month !== undefined) {
      params = params.set('month', month.toString());
    }

    if (year !== undefined) {
      params = params.set('year', year.toString());
    }
    if (clinic) {
      params = params.set('clinic', clinic);
    }

    return this.http.get<any>(`${this.baseUrl}admin/clinic-monthly-report`, { params });
  }

  // New method for Monthly Money Report
  getMonthlyMoneyReport(request: MonthlyReportRequest): Observable<MonthlyReportResponse> {
    let params = new HttpParams()
      .set('month', request.month.toString())
      .set('year', request.year.toString());

    if (request.roomName && request.roomName !== 'packages') {
      params = params.set('roomName', request.roomName);
    }

    return this.http.get<MonthlyReportResponse>(`${this.baseUrl}receptionist/total-money-monthly`, { params });
  }

  // Get all clinic names
  getAllClinics(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}admin/get-all-clinic-names`);
  }
}