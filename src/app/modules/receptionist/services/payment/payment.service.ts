import { Injectable } from '@angular/core';
import{ HttpClient, HttpParams }from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl:string="http://localhost:8080/";
  constructor(private http :HttpClient) { }

  AvaillableMethods(id:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist/patient-own?id=${id}` );
  }
  completePayment(id:any , data:any):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}receptionist/payment-factoring?roomReservationId=${id}` , data);
  }

 }
