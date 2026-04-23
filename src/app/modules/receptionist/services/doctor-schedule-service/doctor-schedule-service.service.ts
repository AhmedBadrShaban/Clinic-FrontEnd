import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorScheduleServiceService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = this.configService.getBaseUrl();
  }

  getAllSchedules(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/DoctorScheduler`);
  }

  newSchedule(data: any) {
    return this.http.post(`${this.baseUrl}api/v1/receptionist/DoctorScheduler`, data);
  }

  changeScheduleStatus(id: number) {
    const url = `${this.baseUrl}api/v1/receptionist/confirmdoctorScheduler`;
    const params = new HttpParams().set('schedulerId', id.toString());
    return this.http.put<any>(url, id, { params });
  }

  editSchedule(updatedData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}api/v1/receptionist/DoctorScheduler`, updatedData);
  }

  deleteSchedule(id: number) {
    const url = `${this.baseUrl}api/v1/admin/delete-doctor-scheduler-by-id`;
    const params = new HttpParams().set('schedulerId', id.toString());
    return this.http.delete<any>(url, { params });
  }

  Search(key: string): Observable<any> {
    const url = `${this.baseUrl}api/v1/receptionist/DoctorScheduler/search`;
    const queryParams = new HttpParams().set("searchString", key);
    return this.http.get<any>(url, { params: queryParams });
  }

  filterByDate(date: any): Observable<any> {
    const url = `${this.baseUrl}api/v1/receptionist/DoctorSchedulerbyDate`;
    const queryParams = new HttpParams().set("date", date);
    return this.http.get<any>(url, { params: queryParams });
  }

  private listOfDataSubject = new BehaviorSubject<readonly any[]>([]);
  listOfData$ = this.listOfDataSubject.asObservable();

  updateListOfData(data: readonly any[]) {
    this.listOfDataSubject.next(data);
  }
}
