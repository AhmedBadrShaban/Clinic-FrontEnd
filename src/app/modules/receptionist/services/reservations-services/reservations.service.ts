import { Injectable } from '@angular/core';
import{ HttpClient, HttpParams }from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {PatientHistory} from "../../models/patient-history";
import {IdlePatients} from "../../models/idle-patients";
import {PatientPoints} from "../../models/patient-points";

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  private baseUrl:string="http://localhost:8080/";
  constructor(private http :HttpClient) { }


  getPatientsNamesAndPhones():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist/patients-name-with-phones` );
  }
  getPatientByNumber(phoneNumber:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist/patients-with-phone?phoneNumber=${phoneNumber}`);
  }
  getHistory(phone:any):Observable<any>{
    console.log('phone before History:>> ', phone);
    return this.http.get<any>(`${this.baseUrl}receptionist/patient-history?phone=${phone}`  );
  }
  getPackages(phone:any):Observable<any>{
    console.log('phone before Packages:>> ', phone);
    return this.http.get<any>(`${this.baseUrl}receptionist/packages-by-phone?phone=${phone}`);
  }
  getPointsHistory(phone:any):Observable<any>{
    console.log('phone before Points History:>> ', phone);
    return this.http.get<any>(`${this.baseUrl}receptionist/point-histories?phone=${phone}`);
  }
  getReservationsHistory(phone:any):Observable<any>{
    console.log('phone before Reservations History:>> ', phone);
    return this.http.get<any>(`${this.baseUrl}receptionist/room-reservation-phone?phone=${phone}`);
  }
  getPaymentHistory(phone:any):Observable<any>{
    console.log('phone before Payment History:>> ', phone);
    return this.http.get<any>(`${this.baseUrl}receptionist/get-patient-daily-sheet?phone=${phone}`);
  }

  modifyOnHistoryTable(id : string , date:PatientHistory){

  }


  // getPatientPoints(phone : string):Observable<PatientPoints>{
  //   const url = 'http://localhost:8080/receptionist/point-histories';
  //   console.log("Points History of patient with Number:" , phone);
  //   let queryParams = new HttpParams().append("phone",phone);
  //   return this.http.get<any>(url,{params:queryParams});
  // }

  sendPoints(fromPhoneNumber: string , toPhoneNumber: string , qty : number){

  }
  private phoneNumberChange = new BehaviorSubject<any>(0);
  phone$ = this.phoneNumberChange.asObservable();
  updatePhoneNumber(data:any) {
    this.phoneNumberChange.next(data);
  }
  private NewPatients= new BehaviorSubject<any>([]);
  update$ = this.NewPatients.asObservable();
  updatePatientsArray(data:any) {
    this.NewPatients.next(data);
  }

}
