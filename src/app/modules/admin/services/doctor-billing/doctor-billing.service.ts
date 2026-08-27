import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';
import { delay, map } from 'rxjs/operators';
import { BillingListRecord, BillingListResponse, BillResult, BillingShift, DoctorMonthlyBillingReportRow, DoctorPreview } from '../../models/doctor-billing';
import { Clinic } from 'src/app/shared/models/rooms.models';
import { ReportsService } from '../reports.service';
import { DoctorsService } from '../doctors/doctors.service';
import {
  mockBillResult,
  mockBillingListRecords,
  mockClinicOptions,
  mockDoctorOptions,
  mockMonthlyReport,
  mockPreviewShifts,
  useMockDoctorBilling
} from './doctor-billing-mock.data';

export interface BillingPreviewParams {
  doctorId?: number;
  clinicBranchId?: number;
  date?: string;
  year?: number;
  month?: number;
}

export interface BillParams {
  doctorId: number;
  clinicBranchId?: number;
  date?: string;
  year?: number;
  month?: number;
}

export interface ReportParams {
  year: number;
  month: number;
  doctorId?: number;
  clinicBranchId?: number;
}

export interface BillingListParams {
  page?: number;
  size?: number;
  doctorId?: number;
  clinicBranchId?: number;
  status?: 'PENDING' | 'PAID' | 'CANCELLED';
  from?: string;
  to?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorBillingService {
  private readonly baseUrl: string;
  private readonly useMockData = useMockDoctorBilling;

  private mockListRecords: BillingListRecord[] = [...mockBillingListRecords];
  private billedDoctorKeys = new Set<string>();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private reportsService: ReportsService,
    private doctorsService: DoctorsService
  ) {
    this.baseUrl = this.configService.getBaseUrl();
  }

  /* Clinics for autocomplete (reports screen pattern: { clinicId, clinicName }) */
  getClinics(): Observable<Clinic[]> {
    if (this.useMockData) {
      return of(mockClinicOptions as unknown as Clinic[]).pipe(delay(300));
    }
    return this.reportsService.getAllClinicsList();
  }

  /* Doctors for autocomplete (New Reservation / doctors list pattern: id + name) */
  getDoctors(): Observable<{ doctorId: number; doctorName: string }[]> {
    if (this.useMockData) {
      return of([...mockDoctorOptions]).pipe(delay(300));
    }
    return this.doctorsService.DoctorsReport().pipe(
      map((list: any[]) => (list || [])
        .filter(d => d.doctorId != null)
        .map(d => ({ doctorId: Number(d.doctorId), doctorName: d.doctorName })))
    );
  }

  /* 1) Preview unbilled shifts for a day */
  previewDay(params: BillingPreviewParams): Observable<DoctorPreview[]> {
    if (this.useMockData) {
      const date = params.date || this.todayIso();
      let shifts = mockPreviewShifts
        .map(s => ({ ...s, billingDate: date }))
        .map(s => this.assignMockIds(s));
      if (params.doctorId) shifts = shifts.filter(s => this.doctorIdForShift(s) === Number(params.doctorId));
      if (params.clinicBranchId) shifts = shifts.filter(s => this.clinicBranchIdForShift(s) === Number(params.clinicBranchId));
      const doctors = this.groupDoctors(shifts);
      return of(doctors).pipe(delay(400));
    }
    let hp = new HttpParams();
    if (params.date) hp = hp.set('date', params.date);
    if (params.doctorId) hp = hp.set('doctorId', params.doctorId.toString());
    if (params.clinicBranchId) hp = hp.set('clinicBranchId', params.clinicBranchId.toString());
    return this.http.get<DoctorPreview[]>(`${this.baseUrl}admin/doctor-billing/preview/day`, { params: hp });
  }

  /* 2) Preview unbilled shifts for a month */
  previewMonth(params: BillingPreviewParams): Observable<DoctorPreview[]> {
    if (this.useMockData) {
      const year = params.year || new Date().getFullYear();
      const month = params.month || new Date().getMonth() + 1;
      const start = `${year}-${String(month).padStart(2, '0')}-01`;
      let shifts = mockPreviewShifts
        .map((s, i) => ({ ...s, billingDate: this.dayOfMonth(year, month, (i % 28) + 1) }))
        .map(s => this.assignMockIds(s));
      if (params.doctorId) shifts = shifts.filter(s => this.doctorIdForShift(s) === Number(params.doctorId));
      if (params.clinicBranchId) shifts = shifts.filter(s => this.clinicBranchIdForShift(s) === Number(params.clinicBranchId));
      const doctors = this.groupDoctors(shifts);
      return of(doctors).pipe(delay(400));
    }
    let hp = new HttpParams();
    if (params.year) hp = hp.set('year', params.year.toString());
    if (params.month) hp = hp.set('month', params.month.toString());
    if (params.doctorId) hp = hp.set('doctorId', params.doctorId.toString());
    if (params.clinicBranchId) hp = hp.set('clinicBranchId', params.clinicBranchId.toString());
    return this.http.get<DoctorPreview[]>(`${this.baseUrl}admin/doctor-billing/preview/month`, { params: hp });
  }

  /* 3) Bill a doctor for a day */
  billDay(params: BillParams): Observable<BillResult> {
    if (this.useMockData) {
      const key = `day:${params.doctorId}:${params.date}`;
      if (this.billedDoctorKeys.has(key)) {
        return throwError(() => ({ error: { message: 'No unbilled records found for this doctor in the given period' } }));
      }
      this.billedDoctorKeys.add(key);
      return of({ ...mockBillResult, doctorId: Number(params.doctorId), periodDescription: params.date!, billedRecordsCount: 2 }).pipe(delay(400));
    }
    let hp = new HttpParams().set('doctorId', params.doctorId.toString());
    if (params.date) hp = hp.set('date', params.date);
    if (params.clinicBranchId) hp = hp.set('clinicBranchId', params.clinicBranchId.toString());
    return this.http.post<BillResult>(`${this.baseUrl}admin/doctor-billing/bill-day`, null, { params: hp });
  }

  /* 4) Bill a doctor for a month */
  billMonth(params: BillParams): Observable<BillResult> {
    if (this.useMockData) {
      const key = `month:${params.doctorId}:${params.year}-${params.month}`;
      if (this.billedDoctorKeys.has(key)) {
        return throwError(() => ({ error: { message: 'No unbilled records found for this doctor in the given period' } }));
      }
      this.billedDoctorKeys.add(key);
      return of({ ...mockBillResult, doctorId: Number(params.doctorId), periodDescription: `${params.year}-${String(params.month).padStart(2, '0')}`, billedRecordsCount: 2 }).pipe(delay(400));
    }
    let hp = new HttpParams().set('doctorId', params.doctorId.toString());
    if (params.year) hp = hp.set('year', params.year.toString());
    if (params.month) hp = hp.set('month', params.month.toString());
    if (params.clinicBranchId) hp = hp.set('clinicBranchId', params.clinicBranchId.toString());
    return this.http.post<BillResult>(`${this.baseUrl}admin/doctor-billing/bill-month`, null, { params: hp });
  }

  /* 5) Monthly billing report per doctor */
  monthlyReport(params: ReportParams): Observable<DoctorMonthlyBillingReportRow[]> {
    if (this.useMockData) {
      let rows = [...mockMonthlyReport];
      if (params.doctorId) rows = rows.filter(r => r.doctorId === params.doctorId);
      return of(rows).pipe(delay(400));
    }
    let hp = new HttpParams()
      .set('year', params.year.toString())
      .set('month', params.month.toString());
    if (params.doctorId) hp = hp.set('doctorId', params.doctorId.toString());
    if (params.clinicBranchId) hp = hp.set('clinicBranchId', params.clinicBranchId.toString());
    return this.http.get<DoctorMonthlyBillingReportRow[]>(`${this.baseUrl}admin/doctor-billing/report`, { params: hp });
  }

  /* 6) Admin billing list (search) */
  billingList(params: BillingListParams): Observable<BillingListResponse> {
    if (this.useMockData) {
      const page = params.page ?? 0;
      const size = params.size ?? 20;
      let filtered = [...this.mockListRecords];
      if (params.doctorId) filtered = filtered.filter(r => r.doctorId === params.doctorId);
      if (params.clinicBranchId) filtered = filtered.filter(r => r.clinicBranchId === params.clinicBranchId);
      if (params.status) filtered = filtered.filter(r => r.paymentStatus === params.status);
      if (params.from) filtered = filtered.filter(r => r.billingDate >= params.from!);
      if (params.to) filtered = filtered.filter(r => r.billingDate <= params.to!);
      const start = page * size;
      const data = filtered.slice(start, start + size);
      return of({
        data,
        currentPage: page,
        totalItems: filtered.length,
        totalPages: Math.ceil(filtered.length / size)
      }).pipe(delay(400));
    }
    let hp = new HttpParams()
      .set('page', (params.page ?? 0).toString())
      .set('size', (params.size ?? 20).toString());
    if (params.doctorId) hp = hp.set('doctorId', params.doctorId.toString());
    if (params.clinicBranchId) hp = hp.set('clinicBranchId', params.clinicBranchId.toString());
    if (params.status) hp = hp.set('status', params.status);
    if (params.from) hp = hp.set('from', params.from);
    if (params.to) hp = hp.set('to', params.to);
    return this.http.get<BillingListResponse>(`${this.baseUrl}receptionist/doctor-billing`, { params: hp });
  }

  /* 7) Billing detail by id */
  getBillingDetail(id: number): Observable<BillingListRecord> {
    if (this.useMockData) {
      const found = this.mockListRecords.find(r => r.id === id);
      if (!found) return throwError(() => ({ status: 404 }));
      return of(found).pipe(delay(400));
    }
    return this.http.get<BillingListRecord>(`${this.baseUrl}receptionist/doctor-billing/${id}`);
  }

  /* 8) Cancel a billing record */
  cancelBilling(id: number): Observable<BillingListRecord> {
    if (this.useMockData) {
      const found = this.mockListRecords.find(r => r.id === id);
      if (!found) return throwError(() => ({ status: 404 }));
      if (found.paymentStatus === 'PAID') {
        return throwError(() => ({ error: { message: 'A paid billing record cannot be cancelled' } }));
      }
      found.paymentStatus = 'CANCELLED';
      return of({ ...found }).pipe(delay(400));
    }
    return this.http.put<BillingListRecord>(`${this.baseUrl}receptionist/doctor-billing/${id}/cancel`, null);
  }

  /* ---- mock helpers ---- */
  private todayIso(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private dayOfMonth(year: number, month: number, day: number): string {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  /* ensure distinct ids for repeated mock shifts */
  private assignMockIds(shift: BillingShift): BillingShift {
    return { ...shift, id: Math.floor(Math.random() * 100000) + 1 };
  }

  private groupDoctors(shifts: BillingShift[]): DoctorPreview[] {
    const grouped = new Map<number, DoctorPreview>();
    for (const shift of shifts) {
      let entry = grouped.get(this.doctorIdForShift(shift));
      if (!entry) {
        entry = { doctorId: this.doctorIdForShift(shift), doctorName: shift.doctorName, totalMoney: 0, shifts: [] };
        grouped.set(entry.doctorId, entry);
      }
      entry.shifts.push(shift);
      entry.totalMoney += shift.totalPaymentAmount;
    }
    return Array.from(grouped.values());
  }

  private doctorIdForShift(shift: BillingShift): number {
    return shift.doctorName?.includes('Ahmed') ? 3 : shift.doctorName?.includes('Salma') ? 5 : 7;
  }

  private clinicBranchIdForShift(shift: BillingShift): number {
    return shift.clinicBranchName?.includes('October') ? 2 : shift.clinicBranchName?.includes('Nasr') ? 3 : 1;
  }
}
