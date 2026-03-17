import {Service} from "../../admin/models/service";

export interface BasicReservationData {
  reservationId: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  clinicName: string;
  note: string;

  service:string[];
  start:string;
  end:string;
  reservedAt :string;
  services:Service[];
}
