import { UpdateReservationComponent } from './../../../rooms/events-grid/update-reservation/update-reservation.component';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationfmService {

    private readonly baseUrl ;
  constructor(private http :HttpClient ,private configService:ConfigService ) {
    this.baseUrl = this.configService.getBaseUrl();

   }

 getAllDoctorsNames():Observable<any>{
  return this.http.get<any>(`${this.baseUrl}receptionist/doctors-names`);
}
getAllServicesNames():Observable<any>{
  return this.http.get<any>(`${this.baseUrl}receptionist/services-names`);
}
getAllServicesNamesToRoom(roomName:any):Observable<any>{
  return this.http.get<any>(`${this.baseUrl}receptionist/services-room?roomName=${roomName}`);
}
  addReservation(data: any, roomName: any, confirm: boolean = false): Observable<any> {
    return this.http.post(
      `${this.baseUrl}receptionist/roomreservation?roomName=${roomName}&confirm=${confirm}`,
      data
    );
  }

  updateReservation(resId: number, data: any, confirm: boolean = false): Observable<any> {
    return this.http.put(
      `${this.baseUrl}receptionist/update-reservation-by-id?reservationId=${resId}&confirm=${confirm}`,
      data
    );
  }
}
