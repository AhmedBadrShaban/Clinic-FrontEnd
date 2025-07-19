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
    return this.http.get<any>(`${this.baseUrl}receptionist/patients-name-with-phones`);
  }

  getPatientsNamesAndPhonesAuto(phone:number): Observable<any> {
    const params = new HttpParams().set('phoneNumber', phone);
    return this.http.get<any>(`${this.baseUrl}receptionist/patients-name-with-phones-v2`, { params } );
  }

  getPatientByNumber(phoneNumber: any): Observable<any> {
    const params = new HttpParams().set('phoneNumber', phoneNumber);
    return this.http.get<any>(`${this.baseUrl}receptionist/patients-with-phone`, { params });
  }

  // 
  getHistory(phone: any, page: number = 0, size: number = 5): Observable<any> {
    const params = new HttpParams()
      .set('phone', phone)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.baseUrl}receptionist/patient-history`, { params });
  }

  // getHistory(phone: any, page: number = 0, size: number = 5): Observable<any> {
  //   const params = new HttpParams().set('phone', phone);
  //   return this.http.get<any>(`${this.baseUrl}receptionist/patient-history`, { params });
  // }

  updateHistory(id: number, updatedData: any): Observable<any> {
    const params = new HttpParams().set('historyId', id.toString());
    return this.http.put<any>(`${this.baseUrl}admin/update-patient-history`, updatedData, { params });
  }

  getPackages(phone: any, page: number = 0, size: number = 5): Observable<any> {
    const params = new HttpParams()
      .set('phone', phone)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.baseUrl}receptionist/packages-by-phone`, { params });
  }

  getPointsHistory(phone: any): Observable<any> {
    const params = new HttpParams().set('phone', phone);
    return this.http.get<any>(`${this.baseUrl}receptionist/point-histories`, { params });
  }

  getReservationsHistory(phone: any): Observable<any> {
    const params = new HttpParams().set('phone', phone);
    return this.http.get<any>(`${this.baseUrl}receptionist/room-reservation-phone`, { params });
  }

  getPaymentHistory(phone: any): Observable<any> {
    const params = new HttpParams().set('phone', phone);
    return this.http.get<any>(`${this.baseUrl}receptionist/get-patient-daily-sheet`, { params });
  }

  extractPhoneNumberFromSearchResult(selectedRecord: any): string | null {
    const parts = selectedRecord.split('-');
    if (parts.length === 2) {
      return parts[1];
    }
    return selectedRecord;
  }

  sendPoints(fromPhoneNumber: string, toPhoneNumber: string, qty: number) {
    // This method is not implemented in the original code.
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

  private history = new BehaviorSubject<any>([]);
  updateHistory$ = this.history.asObservable();
  updatePatientHistory(data: any) {
    this.history.next(data);
  }
}
