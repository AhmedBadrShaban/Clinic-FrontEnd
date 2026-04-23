import { Injectable } from '@angular/core';
import {Service} from "../../models/service";
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
    private readonly baseUrl ;
   constructor(private http:HttpClient , private configService:ConfigService) {
     this.baseUrl = this.configService.getBaseUrl();

    }


  getAllServices(page: number = 0, size: number = 5): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
      return this.http.get<any>(`${this.baseUrl}api/v1/admin/patientservice` , {params})
  }
  getAvaillableService():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/services-names`)
  }
  search(searchVal:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}api/v1/admin/service-search?searchString=${searchVal}`)
  }
  getAllRooms():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}api/v1/admin/rooms/name`);
  }
  addService(data:any){
      return this.http.post(`${this.baseUrl}api/v1/admin/patientservice` , data);
  }

  private listOfDataSubject = new BehaviorSubject<readonly Service[]> ([]);
  listOfData$ = this.listOfDataSubject.asObservable();
  updateData(data: any[]){
    this.listOfDataSubject.next(data);
  }
  // removeServise(id: string){}
  changeStatus(id: any){
    return this.http.patch<any>(`${this.baseUrl}api/v1/admin/update-service-status?id=${id}` , id)
  }

}
