export interface Payments {
  normal: any[];
  points: number[];
  pointsService: PointsService[];
  packages: Package[];
}

export interface NormalPayment {
  serviceName: string;
  pulses: number;
  cash: any;
  visa: any;
  vodafoneCash: any;
  debit: any;
  credit: any;
  instaPay: any;
  totalCost: any;
}

export interface PointsService {
  serviceName: string;
  numberOfPulses: number;
}

export interface Package {
  reservedPackageID: number;
  reservedServiceInPackage: ReservedService;
}

export interface ReservedService {
  reservedServiceId: number;
  serviceName: string;
  sessions: number;
}
export interface CompletedService {
  serviceName: string;
  pulses: number;
  price: number;
  totalCost: number;
  Paid:boolean;
}