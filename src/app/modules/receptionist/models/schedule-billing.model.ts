export type PaymentStatus = 'PENDING' | 'PAID' | 'CANCELLED' | null;

export interface ScheduleBillingServiceLine {
  id?: number;
  patientServiceId?: number;
  serviceName: string;
  serviceCount: number;
  serviceCostApplied: number | null;
  materialCostApplied: number | null;
  doctorPercentageApplied: number | null;
  fixedFeeApplied: number | null;
  linePaymentAmount: number;
}

export interface ScheduleBillingDetail {
  id: number;
  schedulerId: number;
  doctorId: number | null;
  doctorName: string;
  roomId: number | null;
  roomName: string;
  clinicBranchId: number | null;
  clinicBranchName: string;
  billingDate: string;
  totalHoursWorked: number;
  hourlyRateApplied: number;
  hourlyPaymentAmount: number;
  totalPulses: number;
  pulseRateApplied: number;
  pulsePaymentAmount: number;
  totalServicesCount: number;
  servicePaymentAmount: number;
  totalPaymentAmount: number;
  paymentStatus: PaymentStatus;
  paidAt: string | null;
  paidByUsername: string | null;
  serviceLines: ScheduleBillingServiceLine[];
}

export interface MarkPaidResponse {
  id: number;
  schedulerId: number;
  doctorName: string;
  billingDate: string;
  totalPaymentAmount: number;
  paymentStatus: 'PAID';
  paidAt: string;
  paidByUsername: string;
}
