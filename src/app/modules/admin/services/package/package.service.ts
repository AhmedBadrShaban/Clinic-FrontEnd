import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {Package} from "../../models/package";

@Injectable({
  providedIn: 'root'
})
export class PackageService {

    private readonly baseUrl ;
  constructor(private http:HttpClient) { }

  getAllPackages():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}admin/packages`)
  }
  search(searchVal:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}admin/package-search?searchString=${searchVal}`)
  }
  getAllRooms():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist/rooms-names`);
  }
  addPackage(data:any){
      return this.http.post(`${this.baseUrl}admin/packages` , data);
  }

  private listOfDataSubject = new BehaviorSubject<readonly Package[]> ([]);
  listOfData$ = this.listOfDataSubject.asObservable();
  updateData(data: any[]){
    data = data.map(pkg => ({
      ...pkg,
      expand: pkg.services && pkg.services.length > 0
    }));
    this.listOfDataSubject.next(data);
  }
  // removeServise(id: string){}
  changeStatus(id: any){
    return this.http.patch<any>(`${this.baseUrl}admin/update-package-status?id=${id}` , id)
  }
}
