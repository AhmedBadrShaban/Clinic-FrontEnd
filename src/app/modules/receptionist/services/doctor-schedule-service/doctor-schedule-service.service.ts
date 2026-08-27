import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ConfigService } from 'src/app/shared/services/config.service';
import { environment } from 'src/environments/environment';
import { scheduleData } from '../../models/doctor.schedule.model';
import { mockScheduleRows } from './doctor-schedule-mock.data';

@Injectable({
  providedIn: 'root'
})
export class DoctorScheduleServiceService {
  private readonly baseUrl: string;
  private readonly useMockData = environment.useMockData;

  private mockRows: scheduleData[] = [...mockScheduleRows];

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = this.configService.getBaseUrl();
  }

  getAllSchedules(): Observable<any> {
    if (this.useMockData) return of([...this.mockRows]).pipe(delay(400));
    return this.http.get<any>(`${this.baseUrl}receptionist/DoctorScheduler`);
  }

  newSchedule(data: any) {
    if (this.useMockData) return of({ ...data }).pipe(delay(400));
    return this.http.post(`${this.baseUrl}receptionist/DoctorScheduler`, data);
  }

  changeScheduleStatus(id: number) {
    if (this.useMockData) {
      const row = this.mockRows.find(r => r.schedulerId === id);
      if (row) row.confirmed = !row.confirmed;
      return of({ message: 'Schedule status updated' }).pipe(delay(300));
    }
    const url = `${this.baseUrl}receptionist/confirmdoctorScheduler`;
    const params = new HttpParams().set('schedulerId', id.toString());
    return this.http.put<any>(url, id, { params });
  }

  editSchedule(updatedData: any): Observable<any> {
    if (this.useMockData) return of(updatedData).pipe(delay(400));
    return this.http.put(`${this.baseUrl}receptionist/DoctorScheduler`, updatedData);
  }

  deleteSchedule(id: number) {
    if (this.useMockData) {
      this.mockRows = this.mockRows.filter(r => r.schedulerId !== id);
      return of({ message: 'Schedule deleted' }).pipe(delay(300));
    }
    const url = `${this.baseUrl}admin/delete-doctor-scheduler-by-id`;
    const params = new HttpParams().set('schedulerId', id.toString());
    return this.http.delete<any>(url, { params });
  }

  Search(key: string): Observable<any> {
    if (this.useMockData) {
      const q = (key || '').toLowerCase();
      const rows = this.mockRows.filter(r =>
        (r.doctorName || '').toLowerCase().includes(q) ||
        (r.roomName || '').toLowerCase().includes(q) ||
        (r.date || '').toLowerCase().includes(q)
      );
      return of([...rows]).pipe(delay(400));
    }
    const url = `${this.baseUrl}receptionist/DoctorScheduler/search`;
    const queryParams = new HttpParams().set("searchString", key);
    return this.http.get<any>(url, { params: queryParams });
  }

  filterByDate(date: any): Observable<any> {
    if (this.useMockData) {
      // Mock mode: always show all rows so every status is demonstrable
      return of([...this.mockRows]).pipe(delay(400));
    }
    const url = `${this.baseUrl}receptionist/DoctorSchedulerbyDate`;
    const queryParams = new HttpParams().set("date", date);
    return this.http.get<any>(url, { params: queryParams });
  }

  private listOfDataSubject = new BehaviorSubject<readonly any[]>([]);
  listOfData$ = this.listOfDataSubject.asObservable();

  updateListOfData(data: readonly any[]) {
    this.listOfDataSubject.next(data);
  }
}
