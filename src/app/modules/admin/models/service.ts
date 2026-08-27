
export interface Service {
  patientServiceId: string;
  serviceName: string;
  costPerSession: number;
  room: string;
  isActive: boolean;
  rooms:any[];
  fixedDoctorFee?: number | null;
  materialCost?: number | null;
  doctorPercentage?: number | null;
}

export type BillingModel = 'fixed' | 'percentage' | 'none';

export interface CreateServicePayload {
  serviceName: string;
  costPerSession: number;
  rooms: string[];
  fixedDoctorFee?: number | null;
  materialCost?: number | null;
  doctorPercentage?: number | null;
}

export interface UpdateServicePayload {
  serviceName?: string;
  costPerSession?: number;
  fixedDoctorFee?: number | null;
  materialCost?: number | null;
  doctorPercentage?: number | null;
  rooms?: { roomName: string }[];
}

export interface ServiceRoom {
  roomId: number;
  roomName: string;
}
