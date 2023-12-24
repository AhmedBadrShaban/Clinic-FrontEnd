import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {Doctors} from "../../models/doctors";

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {
  private baseUrl:string="http://localhost:8080/";
  private token: string | null = sessionStorage.getItem('token');
  constructor(private http:HttpClient) { }
  addDoctor(data:any){
    return this.http.post(`${this.baseUrl}api/auth/signup/doctor` , data);
}
getAllDoctors():Observable<any>{
  return this.http.get<any>(`${this.baseUrl}admin/doctors`)
}
DoctorsReport():Observable<any>{
  return this.http.get<any>(`${this.baseUrl}admin/doctors-report`)
}
getDoctor(id:any):Observable<any>{
  return this.http.get<any>(`${this.baseUrl}admin/doctor-profile?id=${id}`)
}
getDoctorProfile():Observable<any>{
  return this.http.get<any>(`${this.baseUrl}doctor/doctor-profile`)
}
search(searchVal:any):Observable<any>{
  console.log('searchVal :>> ', searchVal);
  return this.http.get<any>(`${this.baseUrl}admin/doctor-search?searchString=${searchVal}`)
}
// removeServise(id: string){}
changeStatus(userName: any){
  console.log('userName before Sending Api :>> ', userName);
  return this.http.patch<any>(`${this.baseUrl}api/auth/update-user-status?username=${userName}` , userName)
}
updateProfile(id: string, data: any) {
  const params = new HttpParams().set('id', id);
  console.log('data :>> ', data);
  return this.http.put(`${this.baseUrl}admin/update-doctor-profile`, data , { params });
}
private listOfDataSubject = new BehaviorSubject<readonly any[]> ([]);
listOfData$ = this.listOfDataSubject.asObservable();
updateData(data: any[]){
  this.listOfDataSubject.next(data);
}

}
