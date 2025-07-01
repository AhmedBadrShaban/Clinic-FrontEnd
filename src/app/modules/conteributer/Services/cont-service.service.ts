import { Injectable } from '@angular/core';
import {ContData} from "../Models/cont-data";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ContServiceService {

    private readonly baseUrl ;
  constructor(private http :HttpClient ,private configService:ConfigService ) { 
    this.baseUrl = this.configService.getBaseUrl();

  }
   getMonthlyReport(year:any , month:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}admin/monthly-report?year=${year}&month=${month}`);
  }
}
