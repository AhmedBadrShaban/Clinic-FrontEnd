import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Materials } from '../../models/materials';



@Injectable({
  providedIn: 'root'
})
export class MaterialsService {

  private baseUrl:string="http://localhost:8080/";
  constructor(private http:HttpClient) { }

  getAllMaterials():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}admin/materials`)
  }
  search(searchVal:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}admin/materialSearch?materialName=${searchVal}`)
  }
  addMaterial(data:any){
      return this.http.post(`${this.baseUrl}admin/add-material` , data);
  }

  private listOfDataSubject = new BehaviorSubject<readonly Materials[]> ([]);
  listOfData$ = this.listOfDataSubject.asObservable();
  updateData(data: any[]){
    this.listOfDataSubject.next(data);
  }
}
