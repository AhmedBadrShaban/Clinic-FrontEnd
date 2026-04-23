import { Injectable } from '@angular/core';
import{ HttpClient, HttpParams }from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
    private readonly baseUrl ;
  constructor(private http :HttpClient ,private configService:ConfigService ) {
    this.baseUrl = this.configService.getBaseUrl();

   }

  AvaillableMethods(id:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/patient-own?id=${id}` );
  }
  completePayment(id:any , data:any):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}api/v1/receptionist/payment-factoring?roomReservationId=${id}` , data);
  }

 }
