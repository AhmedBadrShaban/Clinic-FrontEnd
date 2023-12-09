import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoverSheetService {

  private baseUrl:string="http://localhost:3000/";
  constructor(private http :HttpClient) { }
  
  getAllSheets():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}CoverSheet`);
  }
}
