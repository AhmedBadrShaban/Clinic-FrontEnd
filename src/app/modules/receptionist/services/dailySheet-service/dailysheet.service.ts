import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class DailysheetService {

    private readonly baseUrl ;
  constructor(private http :HttpClient ,private configService:ConfigService ) {
    this.baseUrl = this.configService.getBaseUrl();

   }

  getAllReciptianists():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}reciptianists`);
  }

  getAllDoctorsNames():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist/doctors-names`);
  }
  getAllDailyInfo():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist/daily-sheet`);
  }
  filterDailySheet(roomName?: string , date?: any , doctorName?: string):Observable<any>{
    const url = 'http://192.168.1.6:8080/receptionist/filter-daily-sheet';
    let queryParams = new HttpParams();
    if(roomName)
    {
      //console.log("Filtling By room :" ,roomName);
      if(roomName!="Room"){
      queryParams =queryParams.append("roomName" , roomName);
      }
    }
    if(date)
    {
      //console.log("Filtling By date :" ,date);
      queryParams =queryParams.append("date" , date);
    }
    if(doctorName)
    {
      //console.log("Filtling By doctorName :" ,doctorName);
      if(doctorName!="Reciptianist"){
      queryParams =queryParams.append("doctorName" , doctorName);
      }
    }
    //console.log("all parameters before sending is : ", queryParams.toString() );
    return this.http.get<any>(url,{params:queryParams});
  }


  // filterDailySheetByRoom(roomName: string):Observable<any>{
  //   const url = 'http://192.168.1.6:8080/receptionist/filter-daily-sheet';
  //   let queryParams = new HttpParams().append("roomName" , roomName);
  //   //console.log("Filter by roomName : " , roomName);
  //   return this.http.get<any>(url,{params:queryParams});
  // }
  // filterDailySheetByDate(date: any):Observable<any>{
  //   const url = 'http://192.168.1.6:8080/receptionist/filter-daily-sheet';
  //   let queryParams = new HttpParams().append("date" , date);
  //   //console.log("Filter by Date : " , date);
  //   return this.http.get<any>(url,{params:queryParams});
  // }
  // filterDailySheetByDoctor(doctor: string):Observable<any>{
  //   const url = 'http://192.168.1.6:8080/receptionist/filter-daily-sheet';
  //   let queryParams = new HttpParams().append("doctorName" , doctor);
  //   //console.log("Filter by doctor : " , doctor);
  //   return this.http.get<any>(url,{params:queryParams});
  // }
}
