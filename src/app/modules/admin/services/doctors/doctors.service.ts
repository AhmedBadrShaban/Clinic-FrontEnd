import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {Doctors} from "../../models/doctors";
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {
    private readonly baseUrl ;
  private token: string | null = sessionStorage.getItem('token');
   constructor(private http:HttpClient , private configService:ConfigService) {
     this.baseUrl = this.configService.getBaseUrl();

    }

  addDoctor(data:any){
    return this.http.post(`${this.baseUrl}api/v1/auth/signup/doctor` , data);
}
getAllDoctors():Observable<any>{
  return this.http.get<any>(`${this.baseUrl}api/v1/admin/doctors`)
}
DoctorsReport():Observable<any>{
  return this.http.get<any>(`${this.baseUrl}api/v1/admin/doctors-report`)
}
getDoctor(id:any):Observable<any>{
  return this.http.get<any>(`${this.baseUrl}api/v1/admin/doctor-profile?id=${id}`)
}
getDoctorProfile():Observable<any>{
  return this.http.get<any>(`${this.baseUrl}api/v1/doctor/doctor-profile`)
}
search(searchVal:any):Observable<any>{
  //console.log('searchVal :>> ', searchVal);
  return this.http.get<any>(`${this.baseUrl}api/v1/admin/doctor-search?searchString=${searchVal}`)
}
// removeServise(id: string){}
changeStatus(userName: any){
  //console.log('userName before Sending Api :>> ', userName);
  return this.http.patch<any>(`${this.baseUrl}api/v1/auth/update-user-status?username=${userName}` , userName)
}
updateProfile(id: string, data: any) {
  const params = new HttpParams().set('id', id);
  //console.log('data :>> ', data);
  return this.http.put(`${this.baseUrl}api/v1/admin/update-doctor-profile`, data , { params });
}
private listOfDataSubject = new BehaviorSubject<readonly any[]> ([]);
listOfData$ = this.listOfDataSubject.asObservable();
updateData(data: any[]){
  this.listOfDataSubject.next(data);
}

}
