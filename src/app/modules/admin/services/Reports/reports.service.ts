import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ReportsService {


  private baseUrl:string="http://localhost:8080/";
  constructor(private http:HttpClient) { }
  getMonthlyReports():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}admin/clinic-monthly-report`)
  }

 
}
