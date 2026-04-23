import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {Materials, product} from '../../models/materials';
import { ConfigService } from 'src/app/shared/services/config.service';



@Injectable({
  providedIn: 'root'
})
export class MaterialsService {

    private readonly baseUrl ;
   constructor(private http:HttpClient , private configService:ConfigService) {
     this.baseUrl = this.configService.getBaseUrl();

    }


  getAllMaterials():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}api/v1/admin/materials`)
  }
  search(searchVal:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}api/v1/admin/materialSearch?materialName=${searchVal}`)
  }
  addMaterial(data:any){
      return this.http.post(`${this.baseUrl}api/v1/admin/add-material` , data);
  }
  addProuduct(data:any){
    //console.log('data :>> ', data);
    return this.http.post(`${this.baseUrl}api/v1/receptionist/product` , data);
  }
  productsReport():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}api/v1/admin/product-report`)
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
