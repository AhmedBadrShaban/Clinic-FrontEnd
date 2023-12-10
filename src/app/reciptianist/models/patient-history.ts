export interface PatientHistory {
  room_reservation_id:number;
  patient_id: string;
  data: string;
  service: String;
  pulse: number;
  fluence1: number;
  fluence2: number;
  spot: string;
  doctor:{
    doctorName:string
  }
  doctorName: string;
  clinic: string;
  note: string;
}
