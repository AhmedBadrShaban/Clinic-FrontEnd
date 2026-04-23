import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';
export interface CoverSheet {
  coverSheetId: number;
  date: string;
  profit: number;
  expenses: number;
  net: number;

  cash: number;
  visa: number;
  vodafoneCash: number;
  debit: number;
  credit: number;
  instaPay: number;

  user: string;
  laserRead: string[];
}
@Injectable({
  providedIn: 'root'
})
export class CoverSheetService {
  private readonly baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.getBaseUrl();
  }

  getAllSheets(date: string): Observable<CoverSheet> {
    return this.http.get<CoverSheet>(
      `${this.baseUrl}api/v1/receptionist/get-cover-sheet-by-date-related-to-receptionist?date=${date}`
    );
  }
}
