export interface Package {
    id:number;
    patientName: string;
    packageName: string;
    reservedAt:string;
    cost:number;
    expire: string;
    confirmed:boolean;
}
export interface ReservedService {
  reservedServiceId: number;
  serviceName: string;
  sessions: number;
}

export interface ReservedPackage {
  reservedId: number;
  reservedService: ReservedService[];
  packageName: string;
  numberOfPoints: number;
  clinicName: string | null;
  reservedAt: string; // Assuming this is a date in string format
  expire: string; // Assuming this is a date in string format
}
