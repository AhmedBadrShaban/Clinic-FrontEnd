import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

    private readonly baseUrl ;
  constructor(private http :HttpClient ,private configService:ConfigService ) { 
    this.baseUrl = this.configService.getBaseUrl();

  }

  getAllServices(id:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}doctor/reservtionservices?id=${id}`);
  }
}
