import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';import {BasicReservationData} from "../Models/basic-reservation-data";
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorReservationsService {
    private readonly baseUrl ;
   constructor(private http:HttpClient , private configService:ConfigService) {
     this.baseUrl = this.configService.getBaseUrl();

   }


  getAllDoctorReservation():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}api/v1/doctor/reservation`)
  }
  completeReservation(id:any , data:any){
    return this.http.post<any>(`${this.baseUrl}api/v1/doctor/completeReservation?id=${id}` , data)
  }

 }
