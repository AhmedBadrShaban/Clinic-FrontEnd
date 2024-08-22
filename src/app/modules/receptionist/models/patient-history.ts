export interface PatientHistory {
  historyId:number;
  patient_id: string;
  date: string;
  service: String;
  pulse: number;
  fluence1: number;
  fluence2: number;
  spot: string;
  doctorName: string;
  clinic: string;
  note: string;
}
