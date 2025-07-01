import{ HttpClient, HttpParams }from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

    private readonly baseUrl ;
  constructor(private http :HttpClient ,private configService:ConfigService ) { 
    this.baseUrl = this.configService.getBaseUrl();

  }

  getAllPackages():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist/packages-names`);
  }
  getPackageDetailsById(id:string):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist/reserved-package-details?id=${id}`);
  }
  updatePatientPackage(id:any , data:any){
    return this.http.put<any>(`${this.baseUrl}receptionist/update-reserved-package?id=${id}` , data);

  }
  getAllReservedPackages():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist/reserved-packages`);
  }
  filterByDate(date:any): Observable<any> {
    const url = 'http://192.168.1.6:8080/receptionist/reserved-package-filter';
    //console.log("filtling by date of :" ,date);
    let queryParams = new HttpParams().append("date",date);
    return this.http.get<any>(url,{params:queryParams});
  }
  reservePackage(reservationData:any){
    //console.log("data before making request: " , reservationData )
    return this.http.post(`${this.baseUrl}receptionist/reservepackage`, reservationData);
   }

  editPackage(packageId: number, updatedData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}packages/${packageId}`, updatedData);
  }

private listOfDataSubject = new BehaviorSubject<readonly any[]>([]);
listOfData$ = this.listOfDataSubject.asObservable();

updateListOfData(data: readonly any[]) {
  this.listOfDataSubject.next(data);
}
}

