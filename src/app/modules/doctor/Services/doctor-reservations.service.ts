import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';import {BasicReservationData} from "../Models/basic-reservation-data";

@Injectable({
  providedIn: 'root'
})
export class DoctorReservationsService {
  private baseUrl:string="http://192.168.1.6:8080/";
  constructor(private http:HttpClient) { }

  getAllDoctorReservation():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}doctor/reservation`)
  }
  completeReservation(id:any , data:any){
    return this.http.post<any>(`${this.baseUrl}doctor/completeReservation?id=${id}` , data)
  }

 }
