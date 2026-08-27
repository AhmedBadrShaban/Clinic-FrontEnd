import { MarkPaidResponse, PaymentStatus, ScheduleBillingDetail } from '../../models/schedule-billing.model';

export const mockBillingDetails: ScheduleBillingDetail[] = [
  {
    id: 5,
    schedulerId: 1709,
    doctorId: 3,
    doctorName: 'Dr. Ahmed Hassan',
    roomId: 1,
    roomName: 'Laser Room 1',
    clinicBranchId: 1,
    clinicBranchName: 'Main Branch',
    billingDate: '2026-08-21',
    totalHoursWorked: 1.0,
    hourlyRateApplied: 10.0,
    hourlyPaymentAmount: 10.0,
    totalPulses: 350,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 7.0,
    totalServicesCount: 1,
    servicePaymentAmount: 20.0,
    totalPaymentAmount: 37.0,
    paymentStatus: 'PENDING',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 1,
        patientServiceId: 2,
        serviceName: 'Bikini + line',
        serviceCount: 1,
        serviceCostApplied: 250.0,
        materialCostApplied: 50.0,
        doctorPercentageApplied: 0.1,
        fixedFeeApplied: null,
        linePaymentAmount: 20.0
      }
    ]
  },
  {
    id: 9,
    schedulerId: 1710,
    doctorId: 5,
    doctorName: 'Dr. Salma Mostafa',
    roomId: 2,
    roomName: 'Room 2',
    clinicBranchId: 2,
    clinicBranchName: 'October',
    billingDate: '2026-08-21',
    totalHoursWorked: 2.0,
    hourlyRateApplied: 10.0,
    hourlyPaymentAmount: 20.0,
    totalPulses: 520,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 10.4,
    totalServicesCount: 2,
    servicePaymentAmount: 45.0,
    totalPaymentAmount: 75.4,
    paymentStatus: 'PAID',
    paidAt: '2026-08-21T09:12:00',
    paidByUsername: 'receptionist_sara',
    serviceLines: [
      {
        id: 3,
        patientServiceId: 7,
        serviceName: 'Full body laser',
        serviceCount: 1,
        serviceCostApplied: 500.0,
        materialCostApplied: 120.0,
        doctorPercentageApplied: 0.1,
        fixedFeeApplied: null,
        linePaymentAmount: 38.0
      },
      {
        id: 4,
        patientServiceId: 8,
        serviceName: 'Underarm wax',
        serviceCount: 1,
        serviceCostApplied: 80.0,
        materialCostApplied: 10.0,
        doctorPercentageApplied: null,
        fixedFeeApplied: 7.0,
        linePaymentAmount: 7.0
      }
    ]
  }
];

/* Per-billingId mark-paid mock: maps billingId to the resolved row flags */
export const mockMarkPaidByBilling: Record<number, { pay: boolean; error?: string }> = {
  5: { pay: true },
  4: {
    pay: false,
    error: 'This billing record can only be marked as paid on its billing date (2026-08-21)'
  },
  11: {
    pay: false,
    error: 'This billing record has already been paid or cancelled and cannot be marked as paid again'
  }
};

/* A billing whose paymentStatus is already PAID (for the idempotent 400 case) */
export function buildMarkPaidResponse(detail: ScheduleBillingDetail, paidByUsername: string): MarkPaidResponse {
  return {
    id: detail.id,
    schedulerId: detail.schedulerId,
    doctorName: detail.doctorName,
    billingDate: detail.billingDate,
    totalPaymentAmount: detail.totalPaymentAmount,
    paymentStatus: 'PAID',
    paidAt: new Date().toISOString().slice(0, 19),
    paidByUsername
  };
}

export function paymentStatusValue(p: PaymentStatus): p is 'PENDING' | 'PAID' | 'CANCELLED' {
  return p === 'PENDING' || p === 'PAID' || p === 'CANCELLED';
}
