export interface BillingServiceLine {
  id?: number;
  patientServiceId?: number;
  serviceName: string;
  serviceCount: number;
  fixedFeeApplied?: number | null;
  serviceCostApplied?: number | null;
  materialCostApplied?: number | null;
  doctorPercentageApplied?: number | null;
  linePaymentAmount: number;
}

export interface BillingShift {
  id: number;
  schedulerId: number;
  doctorName: string;
  roomName: string;
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
  paymentStatus: 'PENDING' | 'PAID' | 'CANCELLED';
  serviceLines: BillingServiceLine[];
}

export interface DoctorPreview {
  doctorId: number;
  doctorName: string;
  totalMoney: number;
  shifts: BillingShift[];
}

export interface BillResult {
  doctorId: number;
  doctorName: string;
  billedRecordsCount: number;
  totalAmount: number;
  totalPulses: number;
  totalServices: number;
  periodDescription: string;
}

export interface DoctorMonthlyBillingReportRow {
  doctorId: number;
  doctorName: string;
  billingMonth: string;
  totalPaidAmount: number;
  remainingAmount: number;
}

export interface BillingListRecord extends BillingShift {
  doctorId: number;
  roomId: number;
  clinicBranchId: number;
  paidAt: string | null;
  paidByUsername: string | null;
  serviceLines: BillingServiceLine[];
}

export interface BillingListResponse {
  data: BillingListRecord[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}
