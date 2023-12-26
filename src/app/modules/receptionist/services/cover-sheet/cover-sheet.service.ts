import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoverSheetService {

  private baseUrl:string="http://localhost:8080/";
  constructor(private http :HttpClient) { }
  
  getAllSheets(date:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist/get-cover-sheet-by-date-related-to-receptionist?date=${date}`);
  }
  // getAllSheets():Observable<any>{
  //   return this.http.get<any>(`${this.baseUrl}receptionist/daily-sheet`);
  // }
}
