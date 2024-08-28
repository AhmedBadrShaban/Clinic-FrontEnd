import { UpdateReservationComponent } from './../../../rooms/events-grid/update-reservation/update-reservation.component';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationfmService {

  private baseUrl:string="http://localhost:8080/";
  constructor(private http :HttpClient) { }

 getAllDoctorsNames():Observable<any>{
  return this.http.get<any>(`${this.baseUrl}receptionist/doctors-names`);
}
getAllServicesNames():Observable<any>{
  return this.http.get<any>(`${this.baseUrl}receptionist/services-names`);
}
getAllServicesNamesToRoom(roomName:any):Observable<any>{
  return this.http.get<any>(`${this.baseUrl}receptionist/services-room?roomName=${roomName}`);
}
addReservation(data:any , roomName:any): Observable<any> {
  //console.log('roomName before Api Request :>> ', roomName);
  //console.log('and Data before Api Request :>> ', data);
    return this.http.post(`${this.baseUrl}receptionist/roomreservation?roomName=${roomName}`, data);
  }
  updateReservation(resId:number ,  data:any){
    //console.log('data before sending Api :>> ', data);
    return this.http.put(`${this.baseUrl}receptionist/update-reservation-by-id?reservationId=${resId}`, data);

  }
}
