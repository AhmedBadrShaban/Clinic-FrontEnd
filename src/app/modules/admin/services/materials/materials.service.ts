import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {Materials, product} from '../../models/materials';



@Injectable({
  providedIn: 'root'
})
export class MaterialsService {

  private baseUrl:string="http://192.168.1.6:8080/";
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
  addProuduct(data:any){
    //console.log('data :>> ', data);
    return this.http.post(`${this.baseUrl}receptionist/product` , data);
  }
  productsReport():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}admin/product-report`)
  }
  private listOfDataSubject = new BehaviorSubject<readonly Materials[]> ([]);
  listOfData$ = this.listOfDataSubject.asObservable();
  updateData(data: any[]){
    this.listOfDataSubject.next(data);
  }

  // getProducts() : product[]{
  //   return [{
  //     materialName : 'golves',
  //     soldQuantity : 2 ,
  //     totalCost : 10,
  //     remainingQuantity : 200
  //   },
  //     {
  //       materialName : 'golves',
  //       soldQuantity : 2 ,
  //       totalCost : 10,
  //       remainingQuantity : 200
  //     },
  //     {
  //       materialName : 'golves',
  //       soldQuantity : 2 ,
  //       totalCost : 10,
  //       remainingQuantity : 200
  //     }]
  // }
}
