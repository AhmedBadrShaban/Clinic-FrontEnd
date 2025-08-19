import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class DailysheetService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = this.configService.getBaseUrl();  
  }

  getAllReciptianists(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}reciptianists`);
  }

  getAllDoctorsNames(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}receptionist/doctors-names`);
  }

  getAllDailyInfo(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}receptionist/daily-sheet`);
  }

  filterDailySheet(roomName?: string, date?: any, doctorName?: string, page: number = 0, size: number = 5): Observable<any> {
    let queryParams = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (roomName && roomName !== 'Room') {
      queryParams = queryParams.set('roomName', roomName);
    }

    if (date) {
      queryParams = queryParams.set('date', date);
    }

    if (doctorName && doctorName !== 'Reciptianist') {
      queryParams = queryParams.set('doctorName', doctorName);
    }

    return this.http.get<any>(`${this.baseUrl}receptionist/filter-daily-sheet-v2`, {
      params: queryParams
    });
  }
}
