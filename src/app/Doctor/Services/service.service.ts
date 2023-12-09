import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private baseUrl:string="http://localhost:3000/";
  constructor(private http :HttpClient) { }
  
  getAllServices():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}services`);
  }
}
