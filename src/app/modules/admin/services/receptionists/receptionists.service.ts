import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {Receptionist} from "../../models/receptionist";

@Injectable({
  providedIn: 'root'
})
export class ReceptionistsService {

  private baseUrl:string="http://localhost:8080/";
  constructor(private http:HttpClient) { }
  addReciptianist(data:any){
    return this.http.post(`${this.baseUrl}api/auth/signup/receptionist` , data);
}
getAllReciptianist():Observable<any>{
  return this.http.get<any>(`${this.baseUrl}admin/receptionists`)
}
getReciptionist(id:any):Observable<any>{
  return this.http.get<any>(`${this.baseUrl}admin/receptionist-profile?id=${id}`)
}
search(searchVal:any):Observable<any>{
  console.log('searchVal :>> ', searchVal);
  return this.http.get<any>(`${this.baseUrl}admin/receptionist-search?searchString=${searchVal}`)
}
private listOfDataSubject = new BehaviorSubject<readonly any[]> ([]);
listOfData$ = this.listOfDataSubject.asObservable();
updateData(data: any[]){
  this.listOfDataSubject.next(data);
}
// removeServise(id: string){}
changeStatus(userName: any){
  return this.http.patch<any>(`${this.baseUrl}api/auth/update-user-status?username=${userName}` , userName)
}
}
