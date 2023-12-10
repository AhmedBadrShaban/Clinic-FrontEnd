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
  getAllPatients():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist/patients` );
  }
  getPatientByNumber(phoneNumber:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist/patients-with-phone?phoneNumber=${phoneNumber}`);
  }
  getPatientsNamesAndPhones():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist/patients-name-with-phones` );
  }
 
  modifyOnHistoryTable(id : string , date:PatientHistory){

  }

  getPatientPoints(phone : string):Observable<PatientPoints>{
    const url = 'http://localhost:8080/receptionist/point-histories';
    console.log("Points History of patient with Number:" , phone);
    let queryParams = new HttpParams().append("phone",phone);
    return this.http.get<any>(url,{params:queryParams});
  }

  sendPoints(fromPhoneNumber: string , toPhoneNumber: string , qty : number){

  }
}
