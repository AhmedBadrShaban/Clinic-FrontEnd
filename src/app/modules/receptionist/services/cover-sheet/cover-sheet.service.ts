import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoverSheetService {

  private baseUrl:string="http://localhost:8080/";
  constructor(private http :HttpClient) { }
  
  getAllSheets():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}reciptianists/get-all-covers-sheet`);
  }
  // getAllSheets():Observable<any>{
  //   return this.http.get<any>(`${this.baseUrl}receptionist/daily-sheet`);
  // }
}
