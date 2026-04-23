import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { PatientHistory } from "../../models/patient-history";
import { IdlePatients } from "../../models/idle-patients";
import { PatientPoints } from "../../models/patient-points";
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = this.configService.getBaseUrl();
  }

  getPatientsNamesAndPhones(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/patients-name-with-phones`);
  }

  getPatientsNamesAndPhonesAuto(phone: any): Observable<any> {
    const params = new HttpParams().set('phoneNumber', phone);
    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/patients-name-with-phones-v2`, { params });
  }

  getPatientByNumber(phoneNumber: any): Observable<any> {
    const params = new HttpParams().set('phoneNumber', phoneNumber);
    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/patients-with-phone`, { params });
  }

  /**
   * Get patient history with optional date and service filters.
   * @param phone      Patient phone number
   * @param page       Page index (0-based)
   * @param size       Page size
   * @param date       Optional filter: date string in YYYY-MM-DD format
   * @param service    Optional filter: treatment area / service name
   */
  getHistory(
    phone: any,
    page: number = 0,
    size: number = 5,
    date?: string | null,
    service?: string | null
  ): Observable<any> {
    let params = new HttpParams()
      .set('phone', phone)
      .set('page', page.toString())
      .set('size', size.toString());

    if (date) {
      params = params.set('date', date);
    }

    if (service) {
      params = params.set('service', service);
    }

    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/patient-history`, { params });
  }

  updateHistory(id: number, updatedData: any): Observable<any> {
    const params = new HttpParams().set('historyId', id.toString());
    return this.http.put<any>(`${this.baseUrl}api/v1/admin/update-patient-history`, updatedData, { params });
  }

  getPackages(phone: any, page: number = 0, size: number = 5): Observable<any> {
    const params = new HttpParams()
      .set('phone', phone)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/packages-by-phone`, { params });
  }

  getPointsHistory(phone: any, page: number = 0, size: number = 5): Observable<any> {
    const params = new HttpParams()
      .set('phone', phone)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/point-histories-v2`, { params });
  }

  getReservationsHistory(phone: string, page: number = 0, size: number = 5): Observable<any> {
    const params = new HttpParams()
      .set('phone', phone)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/room-reservation-phone`, { params });
  }

  getPaymentHistory(phone: string, page: number = 0, size: number = 5): Observable<any> {
    const params = new HttpParams()
      .set('phone', phone)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/get-patient-daily-sheet`, { params });
  }

  extractPhoneNumberFromSearchResult(selectedRecord: any): string | null {
    const parts = selectedRecord.split('-');
    if (parts.length === 2) {
      return parts[1];
    }
    return selectedRecord;
  }

  sendPoints(fromPhoneNumber: string, toPhoneNumber: string, qty: number) { }
  getAdminPatientsSearch(query: string, page: number = 1, size: number = 20): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}api/v1/admin/patients/search`,
      { params: { query, page: page.toString(), size: size.toString() } }
    );
  }
  getTotalPatients(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}api/v1/admin/total-patients`);
  }

  private phoneNumberChange = new BehaviorSubject<any>(0);
  phone$ = this.phoneNumberChange.asObservable();
  updatePhoneNumber(data: any) {
    this.phoneNumberChange.next(data);
  }

  private NewPatients = new BehaviorSubject<any>([]);
  update$ = this.NewPatients.asObservable();
  updatePatientsArray(data: any) {
    this.NewPatients.next(data);
  }
}
