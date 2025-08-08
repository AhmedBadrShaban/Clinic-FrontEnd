import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = this.configService.getBaseUrl();
  }

  // New API methods
  getAllRoomsV2(): Observable<Room[]> {
    const endpoint = sessionStorage.getItem('userType') === 'ROLE_RECEPTIONIST'
      ? `${this.baseUrl}receptionist/rooms-names-to-specific-clinic-v2`
      : `${this.baseUrl}admin/rooms/name-v2`;

    return this.http.get<Room[]>(endpoint).pipe(
      shareReplay(1) // Cache the result
    );
  }

  getRoomWithReservations(roomId: number, date: string): Observable<RoomReservation> {
    return this.http.get<RoomReservation>(
      `${this.baseUrl}receptionist/get-room-with-reservation?roomId=${roomId}&date=${date}`
    );
  }

  // getAllReservationsByDate(date: string): Observable<{ [roomName: string]: any[] }> {
  //   return this.http.get<{ [roomName: string]: any[] }>(
  //     `${this.baseUrl}receptionist/get-rooms-with-all-reservation?date=${date}`
  //   );
  // }

  getAvailableSlots(roomName: string, date: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}receptionist/get-reservation-slots?roomName=${roomName}&reservedAt=${date}`
    );
  }

  changeReservationStatus(id: number, status: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}receptionist/roomreservationn?id=${id}&status=${status}`,
      { id, status }
    );
  }

  addRoom(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}admin/rooms`, data);
  }

  addClinic(data: string): Observable<any> {
    return this.http.post(`${this.baseUrl}admin/clinic-branch`, data);
  }

  checkOutReservation(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}receptionist/normal-payment?id=${id}`);
  }

  allClinics(): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/get-all-clinic-names`);
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

  updateReservations(reservations: { [roomName: string]: any[] }): void {
    this.reservationsSubject.next(reservations);
  }

  updateSlots(slots: any[]): void {
    this.slotsSubject.next(slots);
  }

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }
}