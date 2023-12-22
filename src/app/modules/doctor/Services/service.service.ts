import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private baseUrl:string="http://localhost:8080/";
  constructor(private http :HttpClient) { }
  
  getAllServices(id:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}doctor/reservtionservices?id=${id}`);
  }
}
