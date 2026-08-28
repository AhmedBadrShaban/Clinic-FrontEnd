import { Injectable } from '@angular/core';
import {Service, UpdateServicePayload} from "../../models/service";
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';
import { delay } from 'rxjs/operators';
import {
  MOCK_ROOMS_NAMES,
  MOCK_SERVICES_PAGE
} from './service-mock.data';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
    private readonly baseUrl ;
    private readonly useMockData = environment.useMockData;

    private mockServices = [...MOCK_SERVICES_PAGE.data];
   constructor(private http:HttpClient , private configService:ConfigService) {
     this.baseUrl = this.configService.getBaseUrl();

    }


  getAllServices(page: number = 0, size: number = 5): Observable<any> {
    if (this.useMockData) {
      return of(this.mockServicesPage(page, size)).pipe(delay(400));
    }
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
      return this.http.get<any>(`${this.baseUrl}admin/patientservice` , {params})
  }
  getAvaillableService():Observable<any>{
    if (this.useMockData) {
      return of(this.mockServices.map(s => s.serviceName)).pipe(delay(400));
    }
    return this.http.get<any>(`${this.baseUrl}receptionist/services-names`)
  }
  search(searchVal:any):Observable<any>{
    if (this.useMockData) {
      const filtered = this.mockServices.filter(s =>
        s.serviceName.toLowerCase().includes(String(searchVal).toLowerCase())
      );
      return of(filtered).pipe(delay(400));
    }
    return this.http.get<any>(`${this.baseUrl}admin/service-search?searchString=${searchVal}`)
  }
  getAllRooms():Observable<any>{
    if (this.useMockData) {
      return of([...MOCK_ROOMS_NAMES]).pipe(delay(400));
    }
    return this.http.get<any>(`${this.baseUrl}admin/rooms/name`);
  }
  addService(data:any){
    if (this.useMockData) {
      const name = (data as any)?.serviceName;
      const existing = this.mockServices.find(s =>
        s.serviceName.toLowerCase() === String(name).toLowerCase()
      );
      if (existing) {
        return of({ message: 'Service name Found: ' }).pipe(delay(400));
      }
      const newId = Math.max(0, ...this.mockServices.map(s => Number(s.patientServiceId))) + 1;
      const toAdd: any = {
        patientServiceId: newId,
        serviceName: name,
        costPerSession: (data as any)?.costPerSession,
        isActive: true,
        fixedDoctorFee: (data as any)?.fixedDoctorFee ?? null,
        materialCost: (data as any)?.materialCost ?? null,
        doctorPercentage: (data as any)?.doctorPercentage ?? null,
        rooms: ((data as any)?.rooms ?? []).map((roomName: string, i: number) => ({
          roomId: i + 1, roomName
        }))
      };
      this.mockServices.push(toAdd);
      return of({ message: 'Service added' }).pipe(delay(400));
    }
      return this.http.post(`${this.baseUrl}admin/patientservice` , data);
  }

  updateService(id: number, payload: UpdateServicePayload): Observable<any> {
    if (this.useMockData) {
      const target = this.mockServices.find(s => Number(s.patientServiceId) === Number(id));
      if (!target) {
        return of({ message: 'Service updated successfully' }).pipe(delay(400));
      }
      const validKeys = ['serviceName', 'costPerSession', 'fixedDoctorFee', 'materialCost', 'doctorPercentage', 'rooms'];
      const unknown = Object.keys(payload).find(k => !validKeys.includes(k));
      if (unknown) {
        return of({ message: `Invalid field: ${unknown}` }).pipe(delay(400));
      }
      if (payload.serviceName !== undefined) target.serviceName = payload.serviceName as string;
      if (payload.costPerSession !== undefined) target.costPerSession = payload.costPerSession as number;
      if (payload.fixedDoctorFee !== undefined) target.fixedDoctorFee = payload.fixedDoctorFee;
      if (payload.materialCost !== undefined) target.materialCost = payload.materialCost;
      if (payload.doctorPercentage !== undefined) target.doctorPercentage = payload.doctorPercentage;
      if (payload.rooms !== undefined) {
        const names = (payload.rooms as { roomName: string }[]).map(r => r.roomName);
        const missing = names.find(n => !MOCK_ROOMS_NAMES.includes(n));
        if (missing) {
          return of({ message: 'Room not found' }).pipe(delay(400));
        }
        target.rooms = names.map((n, i) => ({ roomId: i + 1, roomName: n }));
      }
      return of({ message: 'Service updated successfully' }).pipe(delay(400));
    }
    const params = new HttpParams().set('id', id.toString());
    return this.http.put(`${this.baseUrl}admin/update-patient-service`, payload, { params });
  }

  private mockServicesPage(page: number = 0, size: number = 5): any {
    const start = page * size;
    const data = this.mockServices.slice(start, start + size);
    return {
      data,
      currentPage: page,
      totalItems: this.mockServices.length,
      totalPages: Math.ceil(this.mockServices.length / size)
    };
  }

  private listOfDataSubject = new BehaviorSubject<readonly Service[]> ([]);
  listOfData$ = this.listOfDataSubject.asObservable();
  updateData(data: any[]){
    this.listOfDataSubject.next(data);
  }
  // removeServise(id: string){}
  changeStatus(id: any){
    if (this.useMockData) {
      const target = this.mockServices.find(s => Number(s.patientServiceId) === Number(id));
      if (target) target.isActive = !target.isActive;
      return of({ message: 'Status updated' }).pipe(delay(400));
    }
    return this.http.patch<any>(`${this.baseUrl}admin/update-service-status?id=${id}` , id)
  }

}
