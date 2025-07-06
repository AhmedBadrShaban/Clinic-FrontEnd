import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  private readonly baseUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = this.configService.getBaseUrl(); // example: http://localhost:8080/
  }

  getAllPackages(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}receptionist/packages-names`);
  }

  getPackageDetailsById(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.get<any>(`${this.baseUrl}receptionist/reserved-package-details`, { params });
  }

  updatePatientPackage(id: any, data: any) {
    const params = new HttpParams().set('id', id);
    return this.http.put<any>(`${this.baseUrl}receptionist/update-reserved-package`, data, { params });
  }

  getAllReservedPackages(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}receptionist/reserved-packages`);
  }

  filterByDate(date: any): Observable<any> {
    const url = `${this.baseUrl}receptionist/reserved-package-filter`;
    const queryParams = new HttpParams().set('date', date);
    return this.http.get<any>(url, { params: queryParams });
  }

  reservePackage(reservationData: any) {
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
