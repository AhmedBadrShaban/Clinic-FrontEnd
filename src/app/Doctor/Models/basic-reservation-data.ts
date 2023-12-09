import {Service} from "../../Admin/models/service";

export interface BasicReservationData {
  reservationId: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  service:string[];
  start:string;
  end:string;
  services:Service[];
}
