import { Injectable } from '@angular/core';
import{ HttpClient }from '@angular/common/http';
import{ BehaviorSubject, Observable }from'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private baseUrl:string="http://192.168.1.6:8080/";
  constructor(private http :HttpClient) { }
  getAllReservations(date:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}receptionist/get-rooms-with-all-reservation?date=${date}`);
  }
  getRoomReservation(roomName:any , date:any):Observable<any>{
      //console.log("t1");
      return this.http.get<any>(`${this.baseUrl}receptionist/room-reservation?roomName=${roomName}&date=${date}`);
    }
  allRooms():Observable<any>{
    if(sessionStorage.getItem('userType') === 'ROLE_RECEPTIONIST')
    {
      return this.http.get<any>(`${this.baseUrl}receptionist/rooms-object-to-specific-clinic`);
    }
    else
    {
      return this.http.get<any>(`${this.baseUrl}admin/rooms`);
    }
  }
  allRoomsV2():Observable<any>{
    if(sessionStorage.getItem('userType') === 'ROLE_RECEPTIONIST')
    {
      return this.http.get<any>(`${this.baseUrl}receptionist/rooms-names-to-specific-clinic`);
    }
    else
    {
      return this.http.get<any>(`${this.baseUrl}admin/rooms/name`);
    }
  }
  addRoom(data:any){
    return this.http.post(`${this.baseUrl}admin/rooms` , data);
  }
  chengeReservationStatus(id:number , status:string){
    //console.log('chenging reservation status with id : ', id , "to status : " , status);
    return this.http.post(`${this.baseUrl}receptionist/roomreservationn?id=${id}&status=${status}` ,id);

  }
  checkOutReservation(id:number){
    return this.http.get<any>(`${this.baseUrl}receptionist/normal-payment?id=${id}`);
  }
  addClinic(data:string){
    return this.http.post(`${this.baseUrl}admin/clinic-branch` , data);
  }
  allClinics():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}admin/get-all-clinic-names`);
  }

  getAvalliableSlots(roomName:any , date :any){
    return this.http.get<any>(`${this.baseUrl}receptionist/get-reservation-slots?roomName=${roomName}&reservedAt=${date}`);
  }


  private listOfRooms = new BehaviorSubject<readonly any[]> ([]);
rooms$ = this.listOfRooms.asObservable();
updatedRooms(data: any[]){
  this.listOfRooms.next(data);
  }
 private slots = new BehaviorSubject< any[]> ([]);
updateSlots$ = this.slots.asObservable();
updateSlots(data: any[]){
  //console.log('Sending New Slots :>> ');
  this.slots.next(data);
  }
private listOfDataSubject = new BehaviorSubject<readonly any[]> ([]);
listOfData$ = this.listOfDataSubject.asObservable();
updateData(data: any[]){
  this.listOfDataSubject.next(data);
  }
}
