import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';
import { DebitReportResponse } from '../../components/reports/depit-report/debit-report.component';
 
export interface DebitMovement {
  id: number;
  patientId: number;
  patientName: string;
  patientPhone: string;
  clinicId: number;
  clinicName: string;
  createdById: number;
  createdByName: string;
  delta: number;
  balanceAfter: number;
  movementType: 'PACKAGE_RESERVED' | 'PRODUCT_RESERVED' | 'PAYMENT_ADDED' | 'MANUAL_ADJUSTMENT';
  referenceId: number | null;
  referenceType: string | null;
  description: string;
  createdAt: string;
}

export interface DebitMovementsResponse {
  data: DebitMovement[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface DebitMovementsFilter {
  patientId?: number | null;
  clinicId?: number | null;
  createdBy?: number | null;
  movementType?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class DebitReportsService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = this.configService.getBaseUrl();
  }

  getDebitReport(page: number = 0, size: number = 20, clinicName?: string): Observable<DebitReportResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (clinicName && clinicName.trim()) {
      params = params.set('clinicName', clinicName.trim());
    }

    return this.http.get<DebitReportResponse>(`${this.baseUrl}admin/patients/debit-report`, { params });
  }

  getDebitMovements(
    page: number = 0,
    size: number = 20,
    filters: DebitMovementsFilter = {}
  ): Observable<DebitMovementsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters.patientId)    params = params.set('patientId',    filters.patientId.toString());
    if (filters.clinicId)     params = params.set('clinicId',     filters.clinicId.toString());
    if (filters.createdBy)    params = params.set('createdBy',    filters.createdBy.toString());
    if (filters.movementType) params = params.set('movementType', filters.movementType);
    if (filters.fromDate)     params = params.set('fromDate',     filters.fromDate);
    if (filters.toDate)       params = params.set('toDate',       filters.toDate);
    if (filters.sortBy)       params = params.set('sortBy',       filters.sortBy);
    if (filters.sortDir)      params = params.set('sortDir',      filters.sortDir);

    return this.http.get<DebitMovementsResponse>(`${this.baseUrl}admin/debit-movements`, { params });
  }
}