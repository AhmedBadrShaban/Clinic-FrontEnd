import {Time} from "@angular/common";
export enum reservationStatus{
  RESERVED="Reserved",
  IN_PROGRESS="In progress",
  CANCELED = "Canceled",
  READY_TO_CASH="Ready to cash"
}
export interface ServicesToReserve {
  serviceName: string;
  servicePoints: number;
  serviceCost: number;
}
export interface reservation {
  reservationId:number,
  patientId:number;
  patientName:string;
  patientPhone:string;
  doctorId:number;
  doctorName:string,
  reservationDate:string,
  reservationStart:string,
  reservationEnd:string,
  services:string[],
  servicesExpected: ServicesToReserve [],
  servicesActual: ServicesToReserve [],
  StartTimeHour:number,
  EndTimeHour:number,
  StartTimeMin:number,
  EndTimeMin:number,

  status:string
}
