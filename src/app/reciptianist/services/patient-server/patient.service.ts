import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientInfo } from '../../models/patient-Info';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private mockBaseUrl:string="http://localhost:3000/";
  private baseUrl:string="http://localhost:8080/";

  constructor(private http :HttpClient) { }
  // getAllPatient():Observable<any>{
  //   return this.http.get<any>(`${this.baseUrl}patients`);
  // }
  getAllIdlePatients():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}admin/idlepatient`)
  }
  getAllPatientsNumbers():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist/patients-phones`);
  }
  addNewPatient(patientData:any){
    console.log("data : " , patientData )
    return this.http.post(`${this.baseUrl}receptionist/patients` , patientData);
  }
  searchPatients(phoneNumber:any): Observable<any> {
    const url = 'http://localhost:8080/receptionist/patients-with-phone';
    console.log("Searching by Number:" ,phoneNumber);
    let queryParams = new HttpParams().append("phoneNumber",phoneNumber);
    return this.http.get<any>(url,{params:queryParams});
  }
  updatePatient( primaryPhone:string, updatedData:PatientInfo){
    const url = `http://localhost:8080/receptionist/update-patient?phone=${primaryPhone}`;
    return this.http.put<any>(url, updatedData);
  }

}
