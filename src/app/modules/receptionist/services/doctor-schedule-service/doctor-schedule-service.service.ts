import { Injectable } from '@angular/core';
import{ HttpClient, HttpParams }from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';
@Injectable({
  providedIn: 'root'
})
export class DoctorScheduleServiceService {
    private readonly baseUrl ;
  constructor(private http :HttpClient ,private configService:ConfigService ) {
    this.baseUrl = this.configService.getBaseUrl();

   }
  getAllSchedules():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist/DoctorScheduler` );
  }
  newSchedule(data:any){
    return this.http.post(`${this.baseUrl}receptionist/DoctorScheduler` , data);
  }

  changeScheduleStatus(id:number){
       return this.http.put<any>(`${this.baseUrl}receptionist/confirmdoctorScheduler?schedulerId=${id}`, id );
   }
  editSchedule(updatedData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}receptionist/DoctorScheduler`, updatedData);
  }
  deleteSchedule(id:number){
    //console.log('delete ID :>> ',  id);
    return this.http.delete<any>(`${this.baseUrl}admin/delete-doctor-scheduler-by-id?schedulerId=${id}`);
  }
  Search(key:string): Observable<any> {
    const url = 'http://192.168.1.6:8080/receptionist/DoctorScheduler/search';

    let queryParams = new HttpParams().append("searchString",key);

    return this.http.get<any>(url,{params:queryParams});
}
filterByDate(date:any): Observable<any> {
  const url = 'http://192.168.1.6:8080/receptionist/DoctorSchedulerbyDate';
  //console.log("filtling by date of :" ,date);

  let queryParams = new HttpParams().append("date",date);

  return this.http.get<any>(url,{params:queryParams});
}

private listOfDataSubject = new BehaviorSubject<readonly any[]>([]);
listOfData$ = this.listOfDataSubject.asObservable();
updateListOfData(data: readonly any[]) {
  this.listOfDataSubject.next(data);
}
}
