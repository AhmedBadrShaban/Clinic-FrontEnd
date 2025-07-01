import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getMonthlyReports():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}admin/clinic-monthly-report`)
  }


}
