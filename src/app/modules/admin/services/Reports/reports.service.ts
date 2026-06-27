import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';
import { Clinic } from 'src/app/shared/models/rooms.models';

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

// Matches GET /admin/patients/search-v2 response item shape
export interface PatientSearchV2Item {
  patientId: number;
  patientName: string;
  primaryPhone: string;
}

export interface PatientSearchV2Response {
  totalItems: number;
  data: PatientSearchV2Item[];
}

// Matches GET /admin/receptionists/id-and-name response shape
export interface ReceptionistIdAndName {
  receptionistId: number;
  name: string;
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
    if (month !== undefined) params = params.set('month', month.toString());
    if (year !== undefined) params = params.set('year', year.toString());
    if (clinic) params = params.set('clinic', clinic);
    return this.http.get<any>(`${this.baseUrl}admin/clinic-monthly-report`, { params });
  }

  getMonthlyMoneyReport(request: MonthlyReportRequest): Observable<MonthlyReportResponse> {
    let params = new HttpParams()
      .set('month', request.month.toString())
      .set('year', request.year.toString());
    if (request.roomName && request.roomName !== 'packages') {
      params = params.set('roomName', request.roomName);
    }
    return this.http.get<MonthlyReportResponse>(`${this.baseUrl}receptionist/total-money-monthly`, { params });
  }

  getAllClinics(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}admin/get-all-clinic-names`);
  }

  getAllClinicsList(): Observable<Clinic[]> {
    return this.http.get<Clinic[]>(`${this.baseUrl}admin/clinics`);
  }

  /** GET /admin/patients/search-v2 — fast patient search by name or phone */
  searchPatientsV2(search: string, page = 0, size = 10): Observable<PatientSearchV2Response> {
    const params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PatientSearchV2Response>(`${this.baseUrl}admin/patients/search-v2`, { params });
  }

  /** GET /admin/receptionists/id-and-name — lightweight list for autocomplete */
  getReceptionistIdAndName(): Observable<ReceptionistIdAndName[]> {
    return this.http.get<ReceptionistIdAndName[]>(`${this.baseUrl}admin/receptionists/id-and-name`);
  }
}