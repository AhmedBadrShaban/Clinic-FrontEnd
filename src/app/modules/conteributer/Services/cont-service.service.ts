import { Injectable } from '@angular/core';
import {ContData} from "../Models/cont-data";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContServiceService {

  private baseUrl:string="http://localhost:8080/";
  constructor(private http :HttpClient) { }
   getMonthlyReport(year:any , month:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}admin/monthly-report?year=${year}&month=${month}`);
  }
}
