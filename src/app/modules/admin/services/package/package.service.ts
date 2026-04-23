import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {Package} from "../../models/package";
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

    private readonly baseUrl ;
   constructor(private http:HttpClient , private configService:ConfigService) {
     this.baseUrl = this.configService.getBaseUrl();

   }

  getAllPackages(page: number = 0, size: number = 5): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.baseUrl}api/v1/admin/packages`, { params });
  }

  search(searchVal: string, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('searchString', searchVal)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.baseUrl}api/v1/admin/package-search`, { params });
  }

  getAllRooms():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/rooms-names`);
  }
  addPackage(data:any){
      return this.http.post(`${this.baseUrl}api/v1/admin/packages` , data);
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
    return this.http.patch<any>(`${this.baseUrl}api/v1/admin/update-package-status?id=${id}` , id)
  }
}
