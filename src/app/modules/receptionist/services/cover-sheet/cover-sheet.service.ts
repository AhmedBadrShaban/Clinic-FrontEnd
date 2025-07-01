import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class CoverSheetService {

    private readonly baseUrl ;
  constructor(private http :HttpClient ,private configService:ConfigService  ) { 
    this.baseUrl = this.configService.getBaseUrl();

  }

  getAllSheets(date:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist/get-cover-sheet-by-date-related-to-receptionist?date=${date}`);
  }
  // getAllSheets():Observable<any>{
  //   return this.http.get<any>(`${this.baseUrl}receptionist/daily-sheet`);
  // }
}
