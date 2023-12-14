
export interface Service {
  patientServiceId: string;
  serviceName: string;
  costPerSession: number;
  room: string;
  isActive: boolean;
  rooms:any[];
}
