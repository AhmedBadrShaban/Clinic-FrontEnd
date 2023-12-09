import { Injectable } from '@angular/core';
import{ HttpClient }from '@angular/common/http';
import{ BehaviorSubject, Observable }from'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private baseUrl:string="http://localhost:8080/";
  constructor(private http :HttpClient) { }
  getAllReservations():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist/get-rooms-with-all-reservation`);
  }
  getRoomReservation(roomName:any):Observable<any>{
      return this.http.get<any>(`${this.baseUrl}receptionist/room-reservation?roomName=${roomName}`);
    }
  allRooms():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist/rooms-names`);
  }
  addRoom(data:any){
    return this.http.post(`${this.baseUrl}admin/rooms` , data);
  }
  chengeReservationStatus(id:number , status:string){
    console.log('chenging reservation status with id : ', id , "to status : " , status);
    return this.http.post(`${this.baseUrl}receptionist/roomreservationn?id=${id}&status=${status}` ,id);

  }
private listOfDataSubject = new BehaviorSubject<readonly any[]> ([]);
listOfData$ = this.listOfDataSubject.asObservable();
updateData(data: any[]){
  this.listOfDataSubject.next(data);
  }
}
