import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {Receptionist} from "../../models/receptionist";
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ReceptionistsService {

    private readonly baseUrl ;
   constructor(private http:HttpClient , private configService:ConfigService) {
     this.baseUrl = this.configService.getBaseUrl();

   }

  addReciptianist(data:any){
    return this.http.post(`${this.baseUrl}api/v1/auth/signup/receptionist` , data);
}
getAllReciptianist():Observable<any>{
  return this.http.get<any>(`${this.baseUrl}api/v1/admin/receptionists`)
}
getReciptionist(id:any):Observable<any>{
  return this.http.get<any>(`${this.baseUrl}api/v1/admin/receptionist-profile?id=${id}`)
}
updateProfile(id: string, data: any) {
   //console.log('data :>> ', data);
  return this.http.put(`${this.baseUrl}api/v1/admin/update-receptionist-profile?id=${id}`, data);
}
search(searchVal:any):Observable<any>{
  //console.log('searchVal :>> ', searchVal);
  return this.http.get<any>(`${this.baseUrl}api/v1/admin/receptionist-search?searchString=${searchVal}`)
}
private listOfDataSubject = new BehaviorSubject<readonly any[]> ([]);
listOfData$ = this.listOfDataSubject.asObservable();
updateData(data: any[]){
  this.listOfDataSubject.next(data);
}
// removeServise(id: string){}
changeStatus(userName: any){
  return this.http.patch<any>(`${this.baseUrl}api/v1/auth/update-user-status?username=${userName}` , userName)
}
}
