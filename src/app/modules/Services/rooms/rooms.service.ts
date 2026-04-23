import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map, shareReplay } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';

export interface Room {
  roomId: number;
  roomName: string;
}

export interface RoomReservation {
  roomId: number;
  roomName: string;
  reservations: any[];
}
export interface Room {
  id: number;
  name: string;
  clinicName?: string;
  isActive: boolean;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = this.configService.getBaseUrl();
  }

  // New API methods
  getAllRoomsV2(clinicName?: string): Observable<Room[]> {
    const isReceptionist = sessionStorage.getItem('userType') === 'ROLE_RECEPTIONIST';

    let endpoint = isReceptionist
      ? `${this.baseUrl}api/v1/receptionist/rooms-names-to-specific-clinic-v2`
      : `${this.baseUrl}api/v1/admin/rooms/name-v2`;

    let options = {};

    // Only add params when user is admin & clinicName is provided
    if (!isReceptionist && clinicName) {
      options = { params: new HttpParams().set('clinicName', clinicName) };
    }

    return this.http.get<Room[]>(endpoint, options).pipe(
      shareReplay(1) // Cache the result
    );
  }


  getRoomWithReservations(roomId: number, date: string): Observable<RoomReservation> {
    return this.http.get<RoomReservation>(
      `${this.baseUrl}api/v1/receptionist/get-room-with-reservation?roomId=${roomId}&date=${date}`
    );
  }

  // getAllReservationsByDate(date: string): Observable<{ [roomName: string]: any[] }> {
  //   return this.http.get<{ [roomName: string]: any[] }>(
  //     `${this.baseUrl}api/v1/receptionist/get-rooms-with-all-reservation?date=${date}`
  //   );
  // }

  getAvailableSlots(roomName: string, date: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}api/v1/receptionist/get-reservation-slots?roomName=${roomName}&reservedAt=${date}`
    );
  }

  changeReservationStatus(id: number, status: string , reason?: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}api/v1/receptionist/roomreservationn?id=${id}&status=${status}`,
      { id, status }
    );
  }

  addRoom(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}api/v1/admin/rooms`, data);
  }

  addClinic(data: string): Observable<any> {
    return this.http.post(`${this.baseUrl}api/v1/admin/clinic-branch`, data);
  }

  checkOutReservation(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/v1/receptionist/normal-payment?id=${id}`);
  }

  allClinics(): Observable<any> {
    return this.http.get(`${this.baseUrl}api/v1/admin/get-all-clinic-names`);
  }

  // State management with BehaviorSubjects
  private roomsSubject = new BehaviorSubject<Room[]>([]);
  rooms$ = this.roomsSubject.asObservable();

  private reservationsSubject = new BehaviorSubject<{ [roomName: string]: any[] }>({});
  reservations$ = this.reservationsSubject.asObservable();

  private slotsSubject = new BehaviorSubject<any[]>([]);
  slots$ = this.slotsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  updateRooms(rooms: Room[]): void {
    this.roomsSubject.next(rooms);
  }

  updateReservationsForRoom(roomName: string, reservations: any[]): void {
    console.log('recived reservation in subject from room : ' , roomName)
    const current = this.reservationsSubject.value;
    this.reservationsSubject.next({
      ...current,                // keep other rooms
      [roomName]: reservations   // update only this room
    });
  }

  updateSlots(slots: any[]): void {
    this.slotsSubject.next(slots);
  }

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }
}
