import { Time } from "@angular/common";

export interface ReservationRes {
  patientPhone: string;
  doctorName: string;
  start: any;
  end: any;
  service: string[];
  note:string;

}
