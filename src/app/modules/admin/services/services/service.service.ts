import { Injectable } from '@angular/core';
import {Service} from "../../models/service";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
    private readonly baseUrl ;
  constructor(private http:HttpClient) { }

  getAllServices():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}admin/patientservice`)
  }
  getAvaillableService():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist/services-names`)
  }
  search(searchVal:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}admin/service-search?searchString=${searchVal}`)
  }
  getAllRooms():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}admin/rooms/name`);
  }
  addService(data:any){
      return this.http.post(`${this.baseUrl}admin/patientservice` , data);
  }

  private listOfDataSubject = new BehaviorSubject<readonly Service[]> ([]);
  listOfData$ = this.listOfDataSubject.asObservable();
  updateData(data: any[]){
    this.listOfDataSubject.next(data);
  }
  // removeServise(id: string){}
  changeStatus(id: any){
    return this.http.patch<any>(`${this.baseUrl}admin/update-service-status?id=${id}` , id)
  }

}

