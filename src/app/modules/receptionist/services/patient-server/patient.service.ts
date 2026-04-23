import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PatientInfo } from '../../models/patient-Info';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private readonly baseUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = this.configService.getBaseUrl();
  }

  getAllIdlePatients(page: number = 0, size: number = 5): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.baseUrl}api/v1/admin/idlepatient` , {params});
  }

  getAllPatientsNumbers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/patients-phones`);
  }

  addNewPatient(patientData: any) {
    return this.http.post(`${this.baseUrl}api/v1/receptionist/patients`, patientData);
  }

  checkDepit(phone: string): Observable<boolean> {
    const params = new HttpParams().set('phone', phone);
    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/check-debit-for-patient`, { params });
  }

  patientInfo(primaryPhone: any): Observable<any> {
    const params = new HttpParams().set('phoneNumber', primaryPhone);
    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/patients-with-phone`, { params });
  }

  sendPoints(data: any) {
    return this.http.post(`${this.baseUrl}api/v1/receptionist/convertPoints`, data);
  }

  updatePointsHistory(primaryPhone: any): Observable<any> {
    const params = new HttpParams().set('phone', primaryPhone);
    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/point-histories`, { params });
  }

  searchPatients(phoneNumber: any): Observable<any> {
    const params = new HttpParams().set('phoneNumber', phoneNumber);
    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/patients-with-phone`, { params });
  }

  updatePatient(primaryPhone: string, updatedData: PatientInfo) {
    const params = new HttpParams().set('phone', primaryPhone);
    return this.http.put<any>(`${this.baseUrl}api/v1/receptionist/update-patient`, updatedData, { params });
  }

  updatePatientDepit(primaryPhone: string, amount: any) {
    const params = new HttpParams()
      .set('phone', primaryPhone)
      .set('amount', amount);
    return this.http.patch<any>(`${this.baseUrl}api/v1/receptionist/update-debit-for-patient`, amount, { params });
  }

  private listOfDataSubject = new BehaviorSubject<any>([]);
  private listOfDataSubject2 = new BehaviorSubject<any>([]);

  historyObservable$ = this.listOfDataSubject.asObservable();
  out$ = this.listOfDataSubject2.asObservable();

  updateListOfData(data: any) {
    this.listOfDataSubject.next(data);
  }

  updateTotalOut(data: any) {
    this.listOfDataSubject2.next(data);
  }
}
