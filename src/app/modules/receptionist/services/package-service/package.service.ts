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
    this.baseUrl = this.configService.getBaseUrl();
  }

  getAllPackages(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/packages-names`);
  }

  getPackageDetailsById(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/reserved-package-details`, { params });
  }

   getReservedPackagePaymentDetails(id: string | number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/reserved-package-history-details`, { params });
  }

  updatePatientPackage(id: any, data: any) {
    const params = new HttpParams().set('id', id);
    return this.http.put<any>(`${this.baseUrl}api/v1/receptionist/update-reserved-package`, data, { params });
  }

  getAllReservedPackages(
    page: number = 0,
    size: number = 20,
    branchName?: string | null
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (branchName?.trim()) {
      params = params.set('branchName', branchName.trim());
    }

    return this.http.get<any>(`${this.baseUrl}api/v1/receptionist/reserved-packages-v2`, { params });
  }


  filterByDate(date: any): Observable<any> {
    const url = `${this.baseUrl}api/v1/receptionist/reserved-package-filter-v2`;
    const queryParams = new HttpParams().set('date', date);
    return this.http.get<any>(url, { params: queryParams });
  }

  reservePackage(reservationData: any) {
    return this.http.post(`${this.baseUrl}api/v1/receptionist/reservepackage`, reservationData);
  }

  editPackage(packageId: number, updatedData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}api/v1/packages/${packageId}`, updatedData);
  }

  private listOfDataSubject = new BehaviorSubject<readonly any[]>([]);
  listOfData$ = this.listOfDataSubject.asObservable();

  updateListOfData(data: readonly any[]) {
    this.listOfDataSubject.next(data);
  }
}
