import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ReportsService {


    private readonly baseUrl ;
  constructor(private http:HttpClient) { }
  getMonthlyReports():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}admin/clinic-monthly-report`)
  }


}
