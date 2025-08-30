import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';
@Injectable({
  providedIn: 'root'
})
export class ReportsService {


    private readonly baseUrl ;
   constructor(private http:HttpClient , private configService:ConfigService) { 
     this.baseUrl = this.configService.getBaseUrl();

   }
  getMonthlyReports(month?: number, year?: number): Observable<any> {
    let params = new HttpParams();

    if (month !== undefined) {
      params = params.set('month', month.toString());
    }

    if (year !== undefined) {
      params = params.set('year', year.toString());
    }

    return this.http.get<any>(`${this.baseUrl}admin/clinic-monthly-report`, { params });
  }



}
