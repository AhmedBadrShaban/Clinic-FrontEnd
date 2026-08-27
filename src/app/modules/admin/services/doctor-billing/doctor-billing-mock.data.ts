import {
  BillingListRecord,
  BillingListResponse,
  BillingShift,
  DoctorMonthlyBillingReportRow,
  DoctorPreview
} from '../../models/doctor-billing';

export const useMockDoctorBilling = true;

export interface MockClinicOption { clinicId: number; clinicName: string; }
export interface MockDoctorOption { doctorId: number; doctorName: string; }

export const mockClinicOptions: MockClinicOption[] = [
  {
    clinicId: 1,
    clinicName: 'Main Branch'
  },
  {
    clinicId: 2,
    clinicName: 'October'
  },
  {
    clinicId: 3,
    clinicName: 'Nasr City'
  },
  {
    clinicId: 4,
    clinicName: 'Maadi'
  },
  {
    clinicId: 5,
    clinicName: 'Heliopolis'
  },
  {
    clinicId: 6,
    clinicName: 'Zamalek'
  },
  {
    clinicId: 7,
    clinicName: 'New Cairo'
  },
  {
    clinicId: 8,
    clinicName: 'Alexandria - Smouha'
  }
];

export const mockDoctorOptions: MockDoctorOption[] = [
  {
    doctorId: 3,
    doctorName: 'Dr. Ahmed Hassan'
  },
  {
    doctorId: 5,
    doctorName: 'Dr. Salma Mostafa'
  },
  {
    doctorId: 7,
    doctorName: 'Dr. Omar Khaled'
  },
  {
    doctorId: 9,
    doctorName: 'Dr. Mona Fathy'
  },
  {
    doctorId: 11,
    doctorName: 'Dr. Youssef Adel'
  },
  {
    doctorId: 13,
    doctorName: 'Dr. Nourhan Samir'
  },
  {
    doctorId: 15,
    doctorName: 'Dr. Karim Nabil'
  },
  {
    doctorId: 17,
    doctorName: 'Dr. Heba Tarek'
  },
  {
    doctorId: 19,
    doctorName: 'Dr. Mostafa Gaber'
  },
  {
    doctorId: 21,
    doctorName: 'Dr. Reem Sherif'
  }
];

export const mockPreviewShifts: BillingShift[] = [
  {
    id: 205,
    schedulerId: 1720,
    doctorName: 'Dr. Ahmed Hassan',
    roomName: 'Laser Room 2',
    clinicBranchName: 'Zamalek',
    billingDate: '2026-09-17',
    totalHoursWorked: 2,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 20,
    totalPulses: 145,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 2.9,
    totalServicesCount: 4,
    servicePaymentAmount: 90,
    totalPaymentAmount: 112.9,
    paymentStatus: 'PENDING',
    serviceLines: [
      {
        serviceName: 'Bikini + line',
        serviceCount: 2,
        serviceCostApplied: 250,
        materialCostApplied: 50,
        doctorPercentageApplied: 0.1,
        linePaymentAmount: 40
      },
      {
        serviceName: 'Back',
        serviceCount: 2,
        fixedFeeApplied: 25,
        linePaymentAmount: 50
      }
    ]
  },
  {
    id: 206,
    schedulerId: 1721,
    doctorName: 'Dr. Salma Mostafa',
    roomName: 'Laser Room 3',
    clinicBranchName: 'New Cairo',
    billingDate: '2026-09-18',
    totalHoursWorked: 3,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 30,
    totalPulses: 152,
    pulseRateApplied: 1,
    pulsePaymentAmount: 152,
    totalServicesCount: 9,
    servicePaymentAmount: 189,
    totalPaymentAmount: 371,
    paymentStatus: 'PENDING',
    serviceLines: [
      {
        serviceName: 'Back',
        serviceCount: 3,
        fixedFeeApplied: 25,
        linePaymentAmount: 75
      },
      {
        serviceName: 'Chest',
        serviceCount: 3,
        fixedFeeApplied: 20,
        linePaymentAmount: 60
      },
      {
        serviceName: 'Face',
        serviceCount: 3,
        fixedFeeApplied: 18,
        linePaymentAmount: 54
      }
    ]
  },
  {
    id: 207,
    schedulerId: 1722,
    doctorName: 'Dr. Salma Mostafa',
    roomName: 'Treatment Room A',
    clinicBranchName: 'Main Branch',
    billingDate: '2026-09-20',
    totalHoursWorked: 2,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 20,
    totalPulses: 166,
    pulseRateApplied: 1,
    pulsePaymentAmount: 166,
    totalServicesCount: 4,
    servicePaymentAmount: 66,
    totalPaymentAmount: 252,
    paymentStatus: 'PENDING',
    serviceLines: [
      {
        serviceName: 'Face',
        serviceCount: 2,
        fixedFeeApplied: 18,
        linePaymentAmount: 36
      },
      {
        serviceName: 'Arms',
        serviceCount: 2,
        fixedFeeApplied: 15,
        linePaymentAmount: 30
      }
    ]
  },
  {
    id: 208,
    schedulerId: 1723,
    doctorName: 'Dr. Omar Khaled',
    roomName: 'Treatment Room A',
    clinicBranchName: 'Main Branch',
    billingDate: '2026-09-20',
    totalHoursWorked: 2,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 20,
    totalPulses: 166,
    pulseRateApplied: 1,
    pulsePaymentAmount: 166,
    totalServicesCount: 4,
    servicePaymentAmount: 66,
    totalPaymentAmount: 252,
    paymentStatus: 'PENDING',
    serviceLines: [
      {
        serviceName: 'Face',
        serviceCount: 2,
        fixedFeeApplied: 18,
        linePaymentAmount: 36
      },
      {
        serviceName: 'Arms',
        serviceCount: 2,
        fixedFeeApplied: 15,
        linePaymentAmount: 30
      }
    ]
  },
  {
    id: 209,
    schedulerId: 1724,
    doctorName: 'Dr. Omar Khaled',
    roomName: 'Laser Room 1',
    clinicBranchName: 'Nasr City',
    billingDate: '2026-09-22',
    totalHoursWorked: 1,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 10,
    totalPulses: 180,
    pulseRateApplied: 1,
    pulsePaymentAmount: 180,
    totalServicesCount: 1,
    servicePaymentAmount: 20,
    totalPaymentAmount: 210,
    paymentStatus: 'PENDING',
    serviceLines: [
      {
        serviceName: 'Bikini + line',
        serviceCount: 1,
        serviceCostApplied: 250,
        materialCostApplied: 50,
        doctorPercentageApplied: 0.1,
        linePaymentAmount: 20
      }
    ]
  },
  {
    id: 210,
    schedulerId: 1725,
    doctorName: 'Dr. Omar Khaled',
    roomName: 'Laser Room 3',
    clinicBranchName: 'Heliopolis',
    billingDate: '2026-09-24',
    totalHoursWorked: 3,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 30,
    totalPulses: 194,
    pulseRateApplied: 1,
    pulsePaymentAmount: 194,
    totalServicesCount: 9,
    servicePaymentAmount: 180,
    totalPaymentAmount: 404,
    paymentStatus: 'PENDING',
    serviceLines: [
      {
        serviceName: 'Half leg',
        serviceCount: 3,
        fixedFeeApplied: 15,
        linePaymentAmount: 45
      },
      {
        serviceName: 'Back',
        serviceCount: 3,
        fixedFeeApplied: 25,
        linePaymentAmount: 75
      },
      {
        serviceName: 'Chest',
        serviceCount: 3,
        fixedFeeApplied: 20,
        linePaymentAmount: 60
      }
    ]
  },
  {
    id: 211,
    schedulerId: 1726,
    doctorName: 'Dr. Mona Fathy',
    roomName: 'Laser Room 2',
    clinicBranchName: 'Maadi',
    billingDate: '2026-09-23',
    totalHoursWorked: 2,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 20,
    totalPulses: 187,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 3.74,
    totalServicesCount: 4,
    servicePaymentAmount: 70,
    totalPaymentAmount: 93.74,
    paymentStatus: 'PENDING',
    serviceLines: [
      {
        serviceName: 'Full leg',
        serviceCount: 2,
        fixedFeeApplied: 20,
        linePaymentAmount: 40
      },
      {
        serviceName: 'Half leg',
        serviceCount: 2,
        fixedFeeApplied: 15,
        linePaymentAmount: 30
      }
    ]
  },
  {
    id: 212,
    schedulerId: 1727,
    doctorName: 'Dr. Youssef Adel',
    roomName: 'Laser Room 3',
    clinicBranchName: 'Heliopolis',
    billingDate: '2026-09-24',
    totalHoursWorked: 3,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 30,
    totalPulses: 194,
    pulseRateApplied: 1,
    pulsePaymentAmount: 194,
    totalServicesCount: 9,
    servicePaymentAmount: 180,
    totalPaymentAmount: 404,
    paymentStatus: 'PENDING',
    serviceLines: [
      {
        serviceName: 'Half leg',
        serviceCount: 3,
        fixedFeeApplied: 15,
        linePaymentAmount: 45
      },
      {
        serviceName: 'Back',
        serviceCount: 3,
        fixedFeeApplied: 25,
        linePaymentAmount: 75
      },
      {
        serviceName: 'Chest',
        serviceCount: 3,
        fixedFeeApplied: 20,
        linePaymentAmount: 60
      }
    ]
  },
  {
    id: 213,
    schedulerId: 1728,
    doctorName: 'Dr. Youssef Adel',
    roomName: 'Treatment Room A',
    clinicBranchName: 'New Cairo',
    billingDate: '2026-09-26',
    totalHoursWorked: 2,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 20,
    totalPulses: 208,
    pulseRateApplied: 1,
    pulsePaymentAmount: 208,
    totalServicesCount: 4,
    servicePaymentAmount: 80,
    totalPaymentAmount: 308,
    paymentStatus: 'PENDING',
    serviceLines: [
      {
        serviceName: 'Chest',
        serviceCount: 2,
        fixedFeeApplied: 20,
        linePaymentAmount: 40
      },
      {
        serviceName: 'Bikini + line',
        serviceCount: 2,
        serviceCostApplied: 250,
        materialCostApplied: 50,
        doctorPercentageApplied: 0.1,
        linePaymentAmount: 40
      }
    ]
  },
  {
    id: 214,
    schedulerId: 1729,
    doctorName: 'Dr. Nourhan Samir',
    roomName: 'Treatment Room A',
    clinicBranchName: 'New Cairo',
    billingDate: '2026-09-26',
    totalHoursWorked: 2,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 20,
    totalPulses: 208,
    pulseRateApplied: 1,
    pulsePaymentAmount: 208,
    totalServicesCount: 4,
    servicePaymentAmount: 80,
    totalPaymentAmount: 308,
    paymentStatus: 'PENDING',
    serviceLines: [
      {
        serviceName: 'Chest',
        serviceCount: 2,
        fixedFeeApplied: 20,
        linePaymentAmount: 40
      },
      {
        serviceName: 'Bikini + line',
        serviceCount: 2,
        serviceCostApplied: 250,
        materialCostApplied: 50,
        doctorPercentageApplied: 0.1,
        linePaymentAmount: 40
      }
    ]
  },
  {
    id: 215,
    schedulerId: 1730,
    doctorName: 'Dr. Nourhan Samir',
    roomName: 'Laser Room 1',
    clinicBranchName: 'Main Branch',
    billingDate: '2026-09-01',
    totalHoursWorked: 1,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 10,
    totalPulses: 72,
    pulseRateApplied: 1,
    pulsePaymentAmount: 72,
    totalServicesCount: 1,
    servicePaymentAmount: 15,
    totalPaymentAmount: 97,
    paymentStatus: 'PENDING',
    serviceLines: [
      {
        serviceName: 'Arms',
        serviceCount: 1,
        fixedFeeApplied: 15,
        linePaymentAmount: 15
      }
    ]
  },
  {
    id: 216,
    schedulerId: 1731,
    doctorName: 'Dr. Nourhan Samir',
    roomName: 'Laser Room 3',
    clinicBranchName: 'Nasr City',
    billingDate: '2026-09-03',
    totalHoursWorked: 3,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 30,
    totalPulses: 86,
    pulseRateApplied: 1,
    pulsePaymentAmount: 86,
    totalServicesCount: 7,
    servicePaymentAmount: 125,
    totalPaymentAmount: 241,
    paymentStatus: 'PENDING',
    serviceLines: [
      {
        serviceName: 'Full leg',
        serviceCount: 3,
        fixedFeeApplied: 20,
        linePaymentAmount: 60
      },
      {
        serviceName: 'Half leg',
        serviceCount: 3,
        fixedFeeApplied: 15,
        linePaymentAmount: 45
      },
      {
        serviceName: 'Bikini + line',
        serviceCount: 1,
        serviceCostApplied: 250,
        materialCostApplied: 50,
        doctorPercentageApplied: 0.1,
        linePaymentAmount: 20
      }
    ]
  }
];

export const mockPreviewDoctors: DoctorPreview[] = [
  {
    doctorId: 3,
    doctorName: 'Dr. Ahmed Hassan',
    totalMoney: 112.9,
    shifts: [
      {
        id: 205,
        schedulerId: 1720,
        doctorName: 'Dr. Ahmed Hassan',
        roomName: 'Laser Room 2',
        clinicBranchName: 'Zamalek',
        billingDate: '2026-09-17',
        totalHoursWorked: 2,
        hourlyRateApplied: 10,
        hourlyPaymentAmount: 20,
        totalPulses: 145,
        pulseRateApplied: 0.02,
        pulsePaymentAmount: 2.9,
        totalServicesCount: 4,
        servicePaymentAmount: 90,
        totalPaymentAmount: 112.9,
        paymentStatus: 'PENDING',
        serviceLines: [
          {
            serviceName: 'Bikini + line',
            serviceCount: 2,
            serviceCostApplied: 250,
            materialCostApplied: 50,
            doctorPercentageApplied: 0.1,
            linePaymentAmount: 40
          },
          {
            serviceName: 'Back',
            serviceCount: 2,
            fixedFeeApplied: 25,
            linePaymentAmount: 50
          }
        ]
      }
    ]
  },
  {
    doctorId: 5,
    doctorName: 'Dr. Salma Mostafa',
    totalMoney: 623,
    shifts: [
      {
        id: 206,
        schedulerId: 1721,
        doctorName: 'Dr. Salma Mostafa',
        roomName: 'Laser Room 3',
        clinicBranchName: 'New Cairo',
        billingDate: '2026-09-18',
        totalHoursWorked: 3,
        hourlyRateApplied: 10,
        hourlyPaymentAmount: 30,
        totalPulses: 152,
        pulseRateApplied: 1,
        pulsePaymentAmount: 152,
        totalServicesCount: 9,
        servicePaymentAmount: 189,
        totalPaymentAmount: 371,
        paymentStatus: 'PENDING',
        serviceLines: [
          {
            serviceName: 'Back',
            serviceCount: 3,
            fixedFeeApplied: 25,
            linePaymentAmount: 75
          },
          {
            serviceName: 'Chest',
            serviceCount: 3,
            fixedFeeApplied: 20,
            linePaymentAmount: 60
          },
          {
            serviceName: 'Face',
            serviceCount: 3,
            fixedFeeApplied: 18,
            linePaymentAmount: 54
          }
        ]
      },
      {
        id: 207,
        schedulerId: 1722,
        doctorName: 'Dr. Salma Mostafa',
        roomName: 'Treatment Room A',
        clinicBranchName: 'Main Branch',
        billingDate: '2026-09-20',
        totalHoursWorked: 2,
        hourlyRateApplied: 10,
        hourlyPaymentAmount: 20,
        totalPulses: 166,
        pulseRateApplied: 1,
        pulsePaymentAmount: 166,
        totalServicesCount: 4,
        servicePaymentAmount: 66,
        totalPaymentAmount: 252,
        paymentStatus: 'PENDING',
        serviceLines: [
          {
            serviceName: 'Face',
            serviceCount: 2,
            fixedFeeApplied: 18,
            linePaymentAmount: 36
          },
          {
            serviceName: 'Arms',
            serviceCount: 2,
            fixedFeeApplied: 15,
            linePaymentAmount: 30
          }
        ]
      }
    ]
  },
  {
    doctorId: 7,
    doctorName: 'Dr. Omar Khaled',
    totalMoney: 866,
    shifts: [
      {
        id: 208,
        schedulerId: 1723,
        doctorName: 'Dr. Omar Khaled',
        roomName: 'Treatment Room A',
        clinicBranchName: 'Main Branch',
        billingDate: '2026-09-20',
        totalHoursWorked: 2,
        hourlyRateApplied: 10,
        hourlyPaymentAmount: 20,
        totalPulses: 166,
        pulseRateApplied: 1,
        pulsePaymentAmount: 166,
        totalServicesCount: 4,
        servicePaymentAmount: 66,
        totalPaymentAmount: 252,
        paymentStatus: 'PENDING',
        serviceLines: [
          {
            serviceName: 'Face',
            serviceCount: 2,
            fixedFeeApplied: 18,
            linePaymentAmount: 36
          },
          {
            serviceName: 'Arms',
            serviceCount: 2,
            fixedFeeApplied: 15,
            linePaymentAmount: 30
          }
        ]
      },
      {
        id: 209,
        schedulerId: 1724,
        doctorName: 'Dr. Omar Khaled',
        roomName: 'Laser Room 1',
        clinicBranchName: 'Nasr City',
        billingDate: '2026-09-22',
        totalHoursWorked: 1,
        hourlyRateApplied: 10,
        hourlyPaymentAmount: 10,
        totalPulses: 180,
        pulseRateApplied: 1,
        pulsePaymentAmount: 180,
        totalServicesCount: 1,
        servicePaymentAmount: 20,
        totalPaymentAmount: 210,
        paymentStatus: 'PENDING',
        serviceLines: [
          {
            serviceName: 'Bikini + line',
            serviceCount: 1,
            serviceCostApplied: 250,
            materialCostApplied: 50,
            doctorPercentageApplied: 0.1,
            linePaymentAmount: 20
          }
        ]
      },
      {
        id: 210,
        schedulerId: 1725,
        doctorName: 'Dr. Omar Khaled',
        roomName: 'Laser Room 3',
        clinicBranchName: 'Heliopolis',
        billingDate: '2026-09-24',
        totalHoursWorked: 3,
        hourlyRateApplied: 10,
        hourlyPaymentAmount: 30,
        totalPulses: 194,
        pulseRateApplied: 1,
        pulsePaymentAmount: 194,
        totalServicesCount: 9,
        servicePaymentAmount: 180,
        totalPaymentAmount: 404,
        paymentStatus: 'PENDING',
        serviceLines: [
          {
            serviceName: 'Half leg',
            serviceCount: 3,
            fixedFeeApplied: 15,
            linePaymentAmount: 45
          },
          {
            serviceName: 'Back',
            serviceCount: 3,
            fixedFeeApplied: 25,
            linePaymentAmount: 75
          },
          {
            serviceName: 'Chest',
            serviceCount: 3,
            fixedFeeApplied: 20,
            linePaymentAmount: 60
          }
        ]
      }
    ]
  },
  {
    doctorId: 9,
    doctorName: 'Dr. Mona Fathy',
    totalMoney: 93.74,
    shifts: [
      {
        id: 211,
        schedulerId: 1726,
        doctorName: 'Dr. Mona Fathy',
        roomName: 'Laser Room 2',
        clinicBranchName: 'Maadi',
        billingDate: '2026-09-23',
        totalHoursWorked: 2,
        hourlyRateApplied: 10,
        hourlyPaymentAmount: 20,
        totalPulses: 187,
        pulseRateApplied: 0.02,
        pulsePaymentAmount: 3.74,
        totalServicesCount: 4,
        servicePaymentAmount: 70,
        totalPaymentAmount: 93.74,
        paymentStatus: 'PENDING',
        serviceLines: [
          {
            serviceName: 'Full leg',
            serviceCount: 2,
            fixedFeeApplied: 20,
            linePaymentAmount: 40
          },
          {
            serviceName: 'Half leg',
            serviceCount: 2,
            fixedFeeApplied: 15,
            linePaymentAmount: 30
          }
        ]
      }
    ]
  },
  {
    doctorId: 11,
    doctorName: 'Dr. Youssef Adel',
    totalMoney: 712,
    shifts: [
      {
        id: 212,
        schedulerId: 1727,
        doctorName: 'Dr. Youssef Adel',
        roomName: 'Laser Room 3',
        clinicBranchName: 'Heliopolis',
        billingDate: '2026-09-24',
        totalHoursWorked: 3,
        hourlyRateApplied: 10,
        hourlyPaymentAmount: 30,
        totalPulses: 194,
        pulseRateApplied: 1,
        pulsePaymentAmount: 194,
        totalServicesCount: 9,
        servicePaymentAmount: 180,
        totalPaymentAmount: 404,
        paymentStatus: 'PENDING',
        serviceLines: [
          {
            serviceName: 'Half leg',
            serviceCount: 3,
            fixedFeeApplied: 15,
            linePaymentAmount: 45
          },
          {
            serviceName: 'Back',
            serviceCount: 3,
            fixedFeeApplied: 25,
            linePaymentAmount: 75
          },
          {
            serviceName: 'Chest',
            serviceCount: 3,
            fixedFeeApplied: 20,
            linePaymentAmount: 60
          }
        ]
      },
      {
        id: 213,
        schedulerId: 1728,
        doctorName: 'Dr. Youssef Adel',
        roomName: 'Treatment Room A',
        clinicBranchName: 'New Cairo',
        billingDate: '2026-09-26',
        totalHoursWorked: 2,
        hourlyRateApplied: 10,
        hourlyPaymentAmount: 20,
        totalPulses: 208,
        pulseRateApplied: 1,
        pulsePaymentAmount: 208,
        totalServicesCount: 4,
        servicePaymentAmount: 80,
        totalPaymentAmount: 308,
        paymentStatus: 'PENDING',
        serviceLines: [
          {
            serviceName: 'Chest',
            serviceCount: 2,
            fixedFeeApplied: 20,
            linePaymentAmount: 40
          },
          {
            serviceName: 'Bikini + line',
            serviceCount: 2,
            serviceCostApplied: 250,
            materialCostApplied: 50,
            doctorPercentageApplied: 0.1,
            linePaymentAmount: 40
          }
        ]
      }
    ]
  },
  {
    doctorId: 13,
    doctorName: 'Dr. Nourhan Samir',
    totalMoney: 646,
    shifts: [
      {
        id: 214,
        schedulerId: 1729,
        doctorName: 'Dr. Nourhan Samir',
        roomName: 'Treatment Room A',
        clinicBranchName: 'New Cairo',
        billingDate: '2026-09-26',
        totalHoursWorked: 2,
        hourlyRateApplied: 10,
        hourlyPaymentAmount: 20,
        totalPulses: 208,
        pulseRateApplied: 1,
        pulsePaymentAmount: 208,
        totalServicesCount: 4,
        servicePaymentAmount: 80,
        totalPaymentAmount: 308,
        paymentStatus: 'PENDING',
        serviceLines: [
          {
            serviceName: 'Chest',
            serviceCount: 2,
            fixedFeeApplied: 20,
            linePaymentAmount: 40
          },
          {
            serviceName: 'Bikini + line',
            serviceCount: 2,
            serviceCostApplied: 250,
            materialCostApplied: 50,
            doctorPercentageApplied: 0.1,
            linePaymentAmount: 40
          }
        ]
      },
      {
        id: 215,
        schedulerId: 1730,
        doctorName: 'Dr. Nourhan Samir',
        roomName: 'Laser Room 1',
        clinicBranchName: 'Main Branch',
        billingDate: '2026-09-01',
        totalHoursWorked: 1,
        hourlyRateApplied: 10,
        hourlyPaymentAmount: 10,
        totalPulses: 72,
        pulseRateApplied: 1,
        pulsePaymentAmount: 72,
        totalServicesCount: 1,
        servicePaymentAmount: 15,
        totalPaymentAmount: 97,
        paymentStatus: 'PENDING',
        serviceLines: [
          {
            serviceName: 'Arms',
            serviceCount: 1,
            fixedFeeApplied: 15,
            linePaymentAmount: 15
          }
        ]
      },
      {
        id: 216,
        schedulerId: 1731,
        doctorName: 'Dr. Nourhan Samir',
        roomName: 'Laser Room 3',
        clinicBranchName: 'Nasr City',
        billingDate: '2026-09-03',
        totalHoursWorked: 3,
        hourlyRateApplied: 10,
        hourlyPaymentAmount: 30,
        totalPulses: 86,
        pulseRateApplied: 1,
        pulsePaymentAmount: 86,
        totalServicesCount: 7,
        servicePaymentAmount: 125,
        totalPaymentAmount: 241,
        paymentStatus: 'PENDING',
        serviceLines: [
          {
            serviceName: 'Full leg',
            serviceCount: 3,
            fixedFeeApplied: 20,
            linePaymentAmount: 60
          },
          {
            serviceName: 'Half leg',
            serviceCount: 3,
            fixedFeeApplied: 15,
            linePaymentAmount: 45
          },
          {
            serviceName: 'Bikini + line',
            serviceCount: 1,
            serviceCostApplied: 250,
            materialCostApplied: 50,
            doctorPercentageApplied: 0.1,
            linePaymentAmount: 20
          }
        ]
      }
    ]
  }
];

export const mockBillResult = {
  doctorId: 3,
  doctorName: 'Dr. Ahmed Hassan',
  billedRecordsCount: 2,
  totalAmount: 280,
  totalPulses: 200,
  totalServices: 4,
  periodDescription: '2026-09-01'
};

export const mockMonthlyReport: DoctorMonthlyBillingReportRow[] = [
  {
    doctorId: 3,
    doctorName: 'Dr. Ahmed Hassan',
    billingMonth: '2026-07',
    totalPaidAmount: 137,
    remainingAmount: 13
  },
  {
    doctorId: 3,
    doctorName: 'Dr. Ahmed Hassan',
    billingMonth: '2026-08',
    totalPaidAmount: 174,
    remainingAmount: 26
  },
  {
    doctorId: 3,
    doctorName: 'Dr. Ahmed Hassan',
    billingMonth: '2026-09',
    totalPaidAmount: 211,
    remainingAmount: 39
  },
  {
    doctorId: 5,
    doctorName: 'Dr. Salma Mostafa',
    billingMonth: '2026-07',
    totalPaidAmount: 248,
    remainingAmount: 52
  },
  {
    doctorId: 5,
    doctorName: 'Dr. Salma Mostafa',
    billingMonth: '2026-08',
    totalPaidAmount: 285,
    remainingAmount: 65
  },
  {
    doctorId: 5,
    doctorName: 'Dr. Salma Mostafa',
    billingMonth: '2026-09',
    totalPaidAmount: 322,
    remainingAmount: 78
  },
  {
    doctorId: 7,
    doctorName: 'Dr. Omar Khaled',
    billingMonth: '2026-07',
    totalPaidAmount: 359,
    remainingAmount: 91
  },
  {
    doctorId: 7,
    doctorName: 'Dr. Omar Khaled',
    billingMonth: '2026-08',
    totalPaidAmount: 396,
    remainingAmount: 104
  },
  {
    doctorId: 7,
    doctorName: 'Dr. Omar Khaled',
    billingMonth: '2026-09',
    totalPaidAmount: 433,
    remainingAmount: 117
  },
  {
    doctorId: 9,
    doctorName: 'Dr. Mona Fathy',
    billingMonth: '2026-07',
    totalPaidAmount: 470,
    remainingAmount: 130
  },
  {
    doctorId: 9,
    doctorName: 'Dr. Mona Fathy',
    billingMonth: '2026-08',
    totalPaidAmount: 507,
    remainingAmount: 143
  },
  {
    doctorId: 9,
    doctorName: 'Dr. Mona Fathy',
    billingMonth: '2026-09',
    totalPaidAmount: 544,
    remainingAmount: 156
  },
  {
    doctorId: 11,
    doctorName: 'Dr. Youssef Adel',
    billingMonth: '2026-07',
    totalPaidAmount: 581,
    remainingAmount: 169
  },
  {
    doctorId: 11,
    doctorName: 'Dr. Youssef Adel',
    billingMonth: '2026-08',
    totalPaidAmount: 118,
    remainingAmount: 182
  },
  {
    doctorId: 11,
    doctorName: 'Dr. Youssef Adel',
    billingMonth: '2026-09',
    totalPaidAmount: 155,
    remainingAmount: 195
  },
  {
    doctorId: 13,
    doctorName: 'Dr. Nourhan Samir',
    billingMonth: '2026-07',
    totalPaidAmount: 192,
    remainingAmount: 8
  },
  {
    doctorId: 13,
    doctorName: 'Dr. Nourhan Samir',
    billingMonth: '2026-08',
    totalPaidAmount: 229,
    remainingAmount: 21
  },
  {
    doctorId: 13,
    doctorName: 'Dr. Nourhan Samir',
    billingMonth: '2026-09',
    totalPaidAmount: 266,
    remainingAmount: 34
  },
  {
    doctorId: 15,
    doctorName: 'Dr. Karim Nabil',
    billingMonth: '2026-07',
    totalPaidAmount: 303,
    remainingAmount: 47
  },
  {
    doctorId: 15,
    doctorName: 'Dr. Karim Nabil',
    billingMonth: '2026-08',
    totalPaidAmount: 340,
    remainingAmount: 60
  },
  {
    doctorId: 15,
    doctorName: 'Dr. Karim Nabil',
    billingMonth: '2026-09',
    totalPaidAmount: 377,
    remainingAmount: 73
  },
  {
    doctorId: 17,
    doctorName: 'Dr. Heba Tarek',
    billingMonth: '2026-07',
    totalPaidAmount: 414,
    remainingAmount: 86
  },
  {
    doctorId: 17,
    doctorName: 'Dr. Heba Tarek',
    billingMonth: '2026-08',
    totalPaidAmount: 451,
    remainingAmount: 99
  },
  {
    doctorId: 17,
    doctorName: 'Dr. Heba Tarek',
    billingMonth: '2026-09',
    totalPaidAmount: 488,
    remainingAmount: 112
  },
  {
    doctorId: 19,
    doctorName: 'Dr. Mostafa Gaber',
    billingMonth: '2026-07',
    totalPaidAmount: 525,
    remainingAmount: 125
  },
  {
    doctorId: 19,
    doctorName: 'Dr. Mostafa Gaber',
    billingMonth: '2026-08',
    totalPaidAmount: 562,
    remainingAmount: 138
  },
  {
    doctorId: 19,
    doctorName: 'Dr. Mostafa Gaber',
    billingMonth: '2026-09',
    totalPaidAmount: 599,
    remainingAmount: 151
  },
  {
    doctorId: 21,
    doctorName: 'Dr. Reem Sherif',
    billingMonth: '2026-07',
    totalPaidAmount: 136,
    remainingAmount: 164
  },
  {
    doctorId: 21,
    doctorName: 'Dr. Reem Sherif',
    billingMonth: '2026-08',
    totalPaidAmount: 173,
    remainingAmount: 177
  },
  {
    doctorId: 21,
    doctorName: 'Dr. Reem Sherif',
    billingMonth: '2026-09',
    totalPaidAmount: 210,
    remainingAmount: 190
  }
];

export const mockBillingListRecords: BillingListRecord[] = [
  {
    id: 5,
    schedulerId: 1709,
    doctorId: 3,
    doctorName: 'Dr. Ahmed Hassan',
    roomId: 6,
    roomName: 'Treatment Room B',
    clinicBranchId: 6,
    clinicBranchName: 'Zamalek',
    billingDate: '2026-08-06',
    totalHoursWorked: 3,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 30,
    totalPulses: 105,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 2.1,
    totalServicesCount: 8,
    servicePaymentAmount: 145,
    totalPaymentAmount: 177.1,
    paymentStatus: 'CANCELLED',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 50,
        patientServiceId: 10,
        serviceName: 'Bikini + line',
        serviceCount: 2,
        serviceCostApplied: 250,
        materialCostApplied: 50,
        doctorPercentageApplied: 0.1,
        fixedFeeApplied: null,
        linePaymentAmount: 40
      },
      {
        id: 51,
        patientServiceId: 11,
        serviceName: 'Arms',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 15,
        linePaymentAmount: 45
      },
      {
        id: 52,
        patientServiceId: 12,
        serviceName: 'Under arms',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 20,
        linePaymentAmount: 60
      }
    ]
  },
  {
    id: 6,
    schedulerId: 1710,
    doctorId: 3,
    doctorName: 'Dr. Ahmed Hassan',
    roomId: 4,
    roomName: 'Laser Room 4',
    clinicBranchId: 2,
    clinicBranchName: 'October',
    billingDate: '2026-08-10',
    totalHoursWorked: 1,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 10,
    totalPulses: 149,
    pulseRateApplied: 1,
    pulsePaymentAmount: 149,
    totalServicesCount: 1,
    servicePaymentAmount: 15,
    totalPaymentAmount: 174,
    paymentStatus: 'PENDING',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 60,
        patientServiceId: 18,
        serviceName: 'Half leg',
        serviceCount: 1,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 15,
        linePaymentAmount: 15
      }
    ]
  },
  {
    id: 7,
    schedulerId: 1711,
    doctorId: 5,
    doctorName: 'Dr. Salma Mostafa',
    roomId: 2,
    roomName: 'Laser Room 2',
    clinicBranchId: 8,
    clinicBranchName: 'Alexandria - Smouha',
    billingDate: '2026-08-08',
    totalHoursWorked: 2,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 20,
    totalPulses: 127,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 2.54,
    totalServicesCount: 4,
    servicePaymentAmount: 80,
    totalPaymentAmount: 102.54,
    paymentStatus: 'PAID',
    paidAt: '2026-08-09T10:00:00',
    paidByUsername: 'admin',
    serviceLines: [
      {
        id: 70,
        patientServiceId: 14,
        serviceName: 'Under arms',
        serviceCount: 2,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 20,
        linePaymentAmount: 40
      },
      {
        id: 71,
        patientServiceId: 15,
        serviceName: 'Full leg',
        serviceCount: 2,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 20,
        linePaymentAmount: 40
      }
    ]
  },
  {
    id: 8,
    schedulerId: 1712,
    doctorId: 5,
    doctorName: 'Dr. Salma Mostafa',
    roomId: 6,
    roomName: 'Treatment Room B',
    clinicBranchId: 4,
    clinicBranchName: 'Maadi',
    billingDate: '2026-08-12',
    totalHoursWorked: 3,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 30,
    totalPulses: 171,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 3.42,
    totalServicesCount: 9,
    servicePaymentAmount: 159,
    totalPaymentAmount: 192.42,
    paymentStatus: 'CANCELLED',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 80,
        patientServiceId: 22,
        serviceName: 'Chest',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 20,
        linePaymentAmount: 60
      },
      {
        id: 81,
        patientServiceId: 23,
        serviceName: 'Face',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 18,
        linePaymentAmount: 54
      },
      {
        id: 82,
        patientServiceId: 24,
        serviceName: 'Arms',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 15,
        linePaymentAmount: 45
      }
    ]
  },
  {
    id: 9,
    schedulerId: 1713,
    doctorId: 5,
    doctorName: 'Dr. Salma Mostafa',
    roomId: 4,
    roomName: 'Laser Room 4',
    clinicBranchId: 8,
    clinicBranchName: 'Alexandria - Smouha',
    billingDate: '2026-08-16',
    totalHoursWorked: 1,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 10,
    totalPulses: 215,
    pulseRateApplied: 1,
    pulsePaymentAmount: 215,
    totalServicesCount: 2,
    servicePaymentAmount: 40,
    totalPaymentAmount: 265,
    paymentStatus: 'PENDING',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 90,
        patientServiceId: 30,
        serviceName: 'Bikini + line',
        serviceCount: 2,
        serviceCostApplied: 250,
        materialCostApplied: 50,
        doctorPercentageApplied: 0.1,
        fixedFeeApplied: null,
        linePaymentAmount: 40
      }
    ]
  },
  {
    id: 10,
    schedulerId: 1714,
    doctorId: 7,
    doctorName: 'Dr. Omar Khaled',
    roomId: 5,
    roomName: 'Treatment Room A',
    clinicBranchId: 3,
    clinicBranchName: 'Nasr City',
    billingDate: '2026-08-11',
    totalHoursWorked: 2,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 20,
    totalPulses: 160,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 3.2,
    totalServicesCount: 3,
    servicePaymentAmount: 60,
    totalPaymentAmount: 83.2,
    paymentStatus: 'PAID',
    paidAt: '2026-08-12T10:00:00',
    paidByUsername: 'admin',
    serviceLines: [
      {
        id: 100,
        patientServiceId: 20,
        serviceName: 'Bikini + line',
        serviceCount: 1,
        serviceCostApplied: 250,
        materialCostApplied: 50,
        doctorPercentageApplied: 0.1,
        fixedFeeApplied: null,
        linePaymentAmount: 20
      },
      {
        id: 101,
        patientServiceId: 21,
        serviceName: 'Chest',
        serviceCount: 2,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 20,
        linePaymentAmount: 40
      }
    ]
  },
  {
    id: 11,
    schedulerId: 1715,
    doctorId: 7,
    doctorName: 'Dr. Omar Khaled',
    roomId: 3,
    roomName: 'Laser Room 3',
    clinicBranchId: 7,
    clinicBranchName: 'New Cairo',
    billingDate: '2026-08-15',
    totalHoursWorked: 3,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 30,
    totalPulses: 204,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 4.08,
    totalServicesCount: 8,
    servicePaymentAmount: 145,
    totalPaymentAmount: 179.08,
    paymentStatus: 'CANCELLED',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 110,
        patientServiceId: 28,
        serviceName: 'Under arms',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 20,
        linePaymentAmount: 60
      },
      {
        id: 111,
        patientServiceId: 29,
        serviceName: 'Bikini + line',
        serviceCount: 2,
        serviceCostApplied: 250,
        materialCostApplied: 50,
        doctorPercentageApplied: 0.1,
        fixedFeeApplied: null,
        linePaymentAmount: 40
      },
      {
        id: 112,
        patientServiceId: 30,
        serviceName: 'Half leg',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 15,
        linePaymentAmount: 45
      }
    ]
  },
  {
    id: 12,
    schedulerId: 1716,
    doctorId: 7,
    doctorName: 'Dr. Omar Khaled',
    roomId: 1,
    roomName: 'Laser Room 1',
    clinicBranchId: 3,
    clinicBranchName: 'Nasr City',
    billingDate: '2026-08-19',
    totalHoursWorked: 1,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 10,
    totalPulses: 248,
    pulseRateApplied: 1,
    pulsePaymentAmount: 248,
    totalServicesCount: 1,
    servicePaymentAmount: 20,
    totalPaymentAmount: 278,
    paymentStatus: 'PENDING',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 120,
        patientServiceId: 36,
        serviceName: 'Chest',
        serviceCount: 1,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 20,
        linePaymentAmount: 20
      }
    ]
  },
  {
    id: 13,
    schedulerId: 1717,
    doctorId: 7,
    doctorName: 'Dr. Omar Khaled',
    roomId: 5,
    roomName: 'Treatment Room A',
    clinicBranchId: 7,
    clinicBranchName: 'New Cairo',
    billingDate: '2026-08-23',
    totalHoursWorked: 2,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 20,
    totalPulses: 292,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 5.84,
    totalServicesCount: 4,
    servicePaymentAmount: 70,
    totalPaymentAmount: 95.84,
    paymentStatus: 'PAID',
    paidAt: '2026-08-24T10:00:00',
    paidByUsername: 'admin',
    serviceLines: [
      {
        id: 130,
        patientServiceId: 44,
        serviceName: 'Full leg',
        serviceCount: 2,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 20,
        linePaymentAmount: 40
      },
      {
        id: 131,
        patientServiceId: 45,
        serviceName: 'Half leg',
        serviceCount: 2,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 15,
        linePaymentAmount: 30
      }
    ]
  },
  {
    id: 14,
    schedulerId: 1718,
    doctorId: 9,
    doctorName: 'Dr. Mona Fathy',
    roomId: 3,
    roomName: 'Laser Room 3',
    clinicBranchId: 7,
    clinicBranchName: 'New Cairo',
    billingDate: '2026-08-15',
    totalHoursWorked: 3,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 30,
    totalPulses: 204,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 4.08,
    totalServicesCount: 8,
    servicePaymentAmount: 145,
    totalPaymentAmount: 179.08,
    paymentStatus: 'CANCELLED',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 140,
        patientServiceId: 28,
        serviceName: 'Under arms',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 20,
        linePaymentAmount: 60
      },
      {
        id: 141,
        patientServiceId: 29,
        serviceName: 'Bikini + line',
        serviceCount: 2,
        serviceCostApplied: 250,
        materialCostApplied: 50,
        doctorPercentageApplied: 0.1,
        fixedFeeApplied: null,
        linePaymentAmount: 40
      },
      {
        id: 142,
        patientServiceId: 30,
        serviceName: 'Half leg',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 15,
        linePaymentAmount: 45
      }
    ]
  },
  {
    id: 15,
    schedulerId: 1719,
    doctorId: 9,
    doctorName: 'Dr. Mona Fathy',
    roomId: 1,
    roomName: 'Laser Room 1',
    clinicBranchId: 3,
    clinicBranchName: 'Nasr City',
    billingDate: '2026-08-19',
    totalHoursWorked: 1,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 10,
    totalPulses: 248,
    pulseRateApplied: 1,
    pulsePaymentAmount: 248,
    totalServicesCount: 1,
    servicePaymentAmount: 20,
    totalPaymentAmount: 278,
    paymentStatus: 'PENDING',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 150,
        patientServiceId: 36,
        serviceName: 'Chest',
        serviceCount: 1,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 20,
        linePaymentAmount: 20
      }
    ]
  },
  {
    id: 16,
    schedulerId: 1720,
    doctorId: 11,
    doctorName: 'Dr. Youssef Adel',
    roomId: 5,
    roomName: 'Treatment Room A',
    clinicBranchId: 1,
    clinicBranchName: 'Main Branch',
    billingDate: '2026-08-17',
    totalHoursWorked: 2,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 20,
    totalPulses: 226,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 4.52,
    totalServicesCount: 4,
    servicePaymentAmount: 80,
    totalPaymentAmount: 104.52,
    paymentStatus: 'PAID',
    paidAt: '2026-08-18T10:00:00',
    paidByUsername: 'admin',
    serviceLines: [
      {
        id: 160,
        patientServiceId: 32,
        serviceName: 'Half leg',
        serviceCount: 2,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 15,
        linePaymentAmount: 30
      },
      {
        id: 161,
        patientServiceId: 33,
        serviceName: 'Back',
        serviceCount: 2,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 25,
        linePaymentAmount: 50
      }
    ]
  },
  {
    id: 17,
    schedulerId: 1721,
    doctorId: 11,
    doctorName: 'Dr. Youssef Adel',
    roomId: 3,
    roomName: 'Laser Room 3',
    clinicBranchId: 5,
    clinicBranchName: 'Heliopolis',
    billingDate: '2026-08-21',
    totalHoursWorked: 3,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 30,
    totalPulses: 270,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 5.4,
    totalServicesCount: 7,
    servicePaymentAmount: 140,
    totalPaymentAmount: 175.4,
    paymentStatus: 'CANCELLED',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 170,
        patientServiceId: 40,
        serviceName: 'Bikini + line',
        serviceCount: 1,
        serviceCostApplied: 250,
        materialCostApplied: 50,
        doctorPercentageApplied: 0.1,
        fixedFeeApplied: null,
        linePaymentAmount: 20
      },
      {
        id: 171,
        patientServiceId: 41,
        serviceName: 'Under arms',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 20,
        linePaymentAmount: 60
      },
      {
        id: 172,
        patientServiceId: 42,
        serviceName: 'Full leg',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 20,
        linePaymentAmount: 60
      }
    ]
  },
  {
    id: 18,
    schedulerId: 1722,
    doctorId: 11,
    doctorName: 'Dr. Youssef Adel',
    roomId: 1,
    roomName: 'Laser Room 1',
    clinicBranchId: 1,
    clinicBranchName: 'Main Branch',
    billingDate: '2026-08-25',
    totalHoursWorked: 1,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 10,
    totalPulses: 314,
    pulseRateApplied: 1,
    pulsePaymentAmount: 314,
    totalServicesCount: 1,
    servicePaymentAmount: 25,
    totalPaymentAmount: 349,
    paymentStatus: 'PENDING',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 180,
        patientServiceId: 48,
        serviceName: 'Back',
        serviceCount: 1,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 25,
        linePaymentAmount: 25
      }
    ]
  },
  {
    id: 19,
    schedulerId: 1723,
    doctorId: 13,
    doctorName: 'Dr. Nourhan Samir',
    roomId: 2,
    roomName: 'Laser Room 2',
    clinicBranchId: 4,
    clinicBranchName: 'Maadi',
    billingDate: '2026-08-20',
    totalHoursWorked: 2,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 20,
    totalPulses: 259,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 5.18,
    totalServicesCount: 3,
    servicePaymentAmount: 56,
    totalPaymentAmount: 81.18,
    paymentStatus: 'PAID',
    paidAt: '2026-08-21T10:00:00',
    paidByUsername: 'admin',
    serviceLines: [
      {
        id: 190,
        patientServiceId: 38,
        serviceName: 'Face',
        serviceCount: 2,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 18,
        linePaymentAmount: 36
      },
      {
        id: 191,
        patientServiceId: 39,
        serviceName: 'Bikini + line',
        serviceCount: 1,
        serviceCostApplied: 250,
        materialCostApplied: 50,
        doctorPercentageApplied: 0.1,
        fixedFeeApplied: null,
        linePaymentAmount: 20
      }
    ]
  },
  {
    id: 20,
    schedulerId: 1724,
    doctorId: 13,
    doctorName: 'Dr. Nourhan Samir',
    roomId: 6,
    roomName: 'Treatment Room B',
    clinicBranchId: 8,
    clinicBranchName: 'Alexandria - Smouha',
    billingDate: '2026-08-24',
    totalHoursWorked: 3,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 30,
    totalPulses: 303,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 6.06,
    totalServicesCount: 8,
    servicePaymentAmount: 160,
    totalPaymentAmount: 196.06,
    paymentStatus: 'CANCELLED',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 200,
        patientServiceId: 46,
        serviceName: 'Half leg',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 15,
        linePaymentAmount: 45
      },
      {
        id: 201,
        patientServiceId: 47,
        serviceName: 'Back',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 25,
        linePaymentAmount: 75
      },
      {
        id: 202,
        patientServiceId: 48,
        serviceName: 'Bikini + line',
        serviceCount: 2,
        serviceCostApplied: 250,
        materialCostApplied: 50,
        doctorPercentageApplied: 0.1,
        fixedFeeApplied: null,
        linePaymentAmount: 40
      }
    ]
  },
  {
    id: 21,
    schedulerId: 1725,
    doctorId: 13,
    doctorName: 'Dr. Nourhan Samir',
    roomId: 4,
    roomName: 'Laser Room 4',
    clinicBranchId: 4,
    clinicBranchName: 'Maadi',
    billingDate: '2026-08-01',
    totalHoursWorked: 1,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 10,
    totalPulses: 347,
    pulseRateApplied: 1,
    pulsePaymentAmount: 347,
    totalServicesCount: 1,
    servicePaymentAmount: 15,
    totalPaymentAmount: 372,
    paymentStatus: 'PENDING',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 210,
        patientServiceId: 54,
        serviceName: 'Arms',
        serviceCount: 1,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 15,
        linePaymentAmount: 15
      }
    ]
  },
  {
    id: 22,
    schedulerId: 1726,
    doctorId: 13,
    doctorName: 'Dr. Nourhan Samir',
    roomId: 2,
    roomName: 'Laser Room 2',
    clinicBranchId: 8,
    clinicBranchName: 'Alexandria - Smouha',
    billingDate: '2026-08-05',
    totalHoursWorked: 2,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 20,
    totalPulses: 91,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 1.82,
    totalServicesCount: 4,
    servicePaymentAmount: 90,
    totalPaymentAmount: 111.82,
    paymentStatus: 'PAID',
    paidAt: '2026-08-06T10:00:00',
    paidByUsername: 'admin',
    serviceLines: [
      {
        id: 220,
        patientServiceId: 62,
        serviceName: 'Back',
        serviceCount: 2,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 25,
        linePaymentAmount: 50
      },
      {
        id: 221,
        patientServiceId: 63,
        serviceName: 'Chest',
        serviceCount: 2,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 20,
        linePaymentAmount: 40
      }
    ]
  },
  {
    id: 23,
    schedulerId: 1727,
    doctorId: 15,
    doctorName: 'Dr. Karim Nabil',
    roomId: 6,
    roomName: 'Treatment Room B',
    clinicBranchId: 8,
    clinicBranchName: 'Alexandria - Smouha',
    billingDate: '2026-08-24',
    totalHoursWorked: 3,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 30,
    totalPulses: 303,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 6.06,
    totalServicesCount: 8,
    servicePaymentAmount: 160,
    totalPaymentAmount: 196.06,
    paymentStatus: 'CANCELLED',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 230,
        patientServiceId: 46,
        serviceName: 'Half leg',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 15,
        linePaymentAmount: 45
      },
      {
        id: 231,
        patientServiceId: 47,
        serviceName: 'Back',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 25,
        linePaymentAmount: 75
      },
      {
        id: 232,
        patientServiceId: 48,
        serviceName: 'Bikini + line',
        serviceCount: 2,
        serviceCostApplied: 250,
        materialCostApplied: 50,
        doctorPercentageApplied: 0.1,
        fixedFeeApplied: null,
        linePaymentAmount: 40
      }
    ]
  },
  {
    id: 24,
    schedulerId: 1728,
    doctorId: 15,
    doctorName: 'Dr. Karim Nabil',
    roomId: 4,
    roomName: 'Laser Room 4',
    clinicBranchId: 4,
    clinicBranchName: 'Maadi',
    billingDate: '2026-08-01',
    totalHoursWorked: 1,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 10,
    totalPulses: 347,
    pulseRateApplied: 1,
    pulsePaymentAmount: 347,
    totalServicesCount: 1,
    servicePaymentAmount: 15,
    totalPaymentAmount: 372,
    paymentStatus: 'PENDING',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 240,
        patientServiceId: 54,
        serviceName: 'Arms',
        serviceCount: 1,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 15,
        linePaymentAmount: 15
      }
    ]
  },
  {
    id: 25,
    schedulerId: 1729,
    doctorId: 17,
    doctorName: 'Dr. Heba Tarek',
    roomId: 2,
    roomName: 'Laser Room 2',
    clinicBranchId: 2,
    clinicBranchName: 'October',
    billingDate: '2026-08-26',
    totalHoursWorked: 2,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 20,
    totalPulses: 325,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 6.5,
    totalServicesCount: 4,
    servicePaymentAmount: 76,
    totalPaymentAmount: 102.5,
    paymentStatus: 'PAID',
    paidAt: '2026-08-27T10:00:00',
    paidByUsername: 'admin',
    serviceLines: [
      {
        id: 250,
        patientServiceId: 50,
        serviceName: 'Bikini + line',
        serviceCount: 2,
        serviceCostApplied: 250,
        materialCostApplied: 50,
        doctorPercentageApplied: 0.1,
        fixedFeeApplied: null,
        linePaymentAmount: 40
      },
      {
        id: 251,
        patientServiceId: 51,
        serviceName: 'Face',
        serviceCount: 2,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 18,
        linePaymentAmount: 36
      }
    ]
  },
  {
    id: 26,
    schedulerId: 1730,
    doctorId: 17,
    doctorName: 'Dr. Heba Tarek',
    roomId: 6,
    roomName: 'Treatment Room B',
    clinicBranchId: 6,
    clinicBranchName: 'Zamalek',
    billingDate: '2026-08-03',
    totalHoursWorked: 3,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 30,
    totalPulses: 69,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 1.38,
    totalServicesCount: 7,
    servicePaymentAmount: 155,
    totalPaymentAmount: 186.38,
    paymentStatus: 'CANCELLED',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 260,
        patientServiceId: 58,
        serviceName: 'Full leg',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 20,
        linePaymentAmount: 60
      },
      {
        id: 261,
        patientServiceId: 59,
        serviceName: 'Bikini + line',
        serviceCount: 1,
        serviceCostApplied: 250,
        materialCostApplied: 50,
        doctorPercentageApplied: 0.1,
        fixedFeeApplied: null,
        linePaymentAmount: 20
      },
      {
        id: 262,
        patientServiceId: 60,
        serviceName: 'Back',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 25,
        linePaymentAmount: 75
      }
    ]
  },
  {
    id: 27,
    schedulerId: 1731,
    doctorId: 17,
    doctorName: 'Dr. Heba Tarek',
    roomId: 4,
    roomName: 'Laser Room 4',
    clinicBranchId: 2,
    clinicBranchName: 'October',
    billingDate: '2026-08-07',
    totalHoursWorked: 1,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 10,
    totalPulses: 113,
    pulseRateApplied: 1,
    pulsePaymentAmount: 113,
    totalServicesCount: 1,
    servicePaymentAmount: 18,
    totalPaymentAmount: 141,
    paymentStatus: 'PENDING',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 270,
        patientServiceId: 66,
        serviceName: 'Face',
        serviceCount: 1,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 18,
        linePaymentAmount: 18
      }
    ]
  },
  {
    id: 28,
    schedulerId: 1732,
    doctorId: 19,
    doctorName: 'Dr. Mostafa Gaber',
    roomId: 5,
    roomName: 'Treatment Room A',
    clinicBranchId: 5,
    clinicBranchName: 'Heliopolis',
    billingDate: '2026-08-02',
    totalHoursWorked: 2,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 20,
    totalPulses: 58,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 1.16,
    totalServicesCount: 4,
    servicePaymentAmount: 80,
    totalPaymentAmount: 101.16,
    paymentStatus: 'PAID',
    paidAt: '2026-08-03T10:00:00',
    paidByUsername: 'admin',
    serviceLines: [
      {
        id: 280,
        patientServiceId: 56,
        serviceName: 'Under arms',
        serviceCount: 2,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 20,
        linePaymentAmount: 40
      },
      {
        id: 281,
        patientServiceId: 57,
        serviceName: 'Full leg',
        serviceCount: 2,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 20,
        linePaymentAmount: 40
      }
    ]
  },
  {
    id: 29,
    schedulerId: 1733,
    doctorId: 19,
    doctorName: 'Dr. Mostafa Gaber',
    roomId: 3,
    roomName: 'Laser Room 3',
    clinicBranchId: 1,
    clinicBranchName: 'Main Branch',
    billingDate: '2026-08-06',
    totalHoursWorked: 3,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 30,
    totalPulses: 102,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 2.04,
    totalServicesCount: 9,
    servicePaymentAmount: 159,
    totalPaymentAmount: 191.04,
    paymentStatus: 'CANCELLED',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 290,
        patientServiceId: 64,
        serviceName: 'Chest',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 20,
        linePaymentAmount: 60
      },
      {
        id: 291,
        patientServiceId: 65,
        serviceName: 'Face',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 18,
        linePaymentAmount: 54
      },
      {
        id: 292,
        patientServiceId: 66,
        serviceName: 'Arms',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 15,
        linePaymentAmount: 45
      }
    ]
  },
  {
    id: 30,
    schedulerId: 1734,
    doctorId: 19,
    doctorName: 'Dr. Mostafa Gaber',
    roomId: 1,
    roomName: 'Laser Room 1',
    clinicBranchId: 5,
    clinicBranchName: 'Heliopolis',
    billingDate: '2026-08-10',
    totalHoursWorked: 1,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 10,
    totalPulses: 146,
    pulseRateApplied: 1,
    pulsePaymentAmount: 146,
    totalServicesCount: 1,
    servicePaymentAmount: 20,
    totalPaymentAmount: 176,
    paymentStatus: 'PENDING',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 300,
        patientServiceId: 72,
        serviceName: 'Full leg',
        serviceCount: 1,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 20,
        linePaymentAmount: 20
      }
    ]
  },
  {
    id: 31,
    schedulerId: 1735,
    doctorId: 19,
    doctorName: 'Dr. Mostafa Gaber',
    roomId: 5,
    roomName: 'Treatment Room A',
    clinicBranchId: 1,
    clinicBranchName: 'Main Branch',
    billingDate: '2026-08-14',
    totalHoursWorked: 2,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 20,
    totalPulses: 190,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 3.8,
    totalServicesCount: 3,
    servicePaymentAmount: 50,
    totalPaymentAmount: 73.8,
    paymentStatus: 'PAID',
    paidAt: '2026-08-15T10:00:00',
    paidByUsername: 'admin',
    serviceLines: [
      {
        id: 310,
        patientServiceId: 80,
        serviceName: 'Bikini + line',
        serviceCount: 1,
        serviceCostApplied: 250,
        materialCostApplied: 50,
        doctorPercentageApplied: 0.1,
        fixedFeeApplied: null,
        linePaymentAmount: 20
      },
      {
        id: 311,
        patientServiceId: 81,
        serviceName: 'Arms',
        serviceCount: 2,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 15,
        linePaymentAmount: 30
      }
    ]
  },
  {
    id: 32,
    schedulerId: 1736,
    doctorId: 21,
    doctorName: 'Dr. Reem Sherif',
    roomId: 3,
    roomName: 'Laser Room 3',
    clinicBranchId: 1,
    clinicBranchName: 'Main Branch',
    billingDate: '2026-08-06',
    totalHoursWorked: 3,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 30,
    totalPulses: 102,
    pulseRateApplied: 0.02,
    pulsePaymentAmount: 2.04,
    totalServicesCount: 9,
    servicePaymentAmount: 159,
    totalPaymentAmount: 191.04,
    paymentStatus: 'CANCELLED',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 320,
        patientServiceId: 64,
        serviceName: 'Chest',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 20,
        linePaymentAmount: 60
      },
      {
        id: 321,
        patientServiceId: 65,
        serviceName: 'Face',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 18,
        linePaymentAmount: 54
      },
      {
        id: 322,
        patientServiceId: 66,
        serviceName: 'Arms',
        serviceCount: 3,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 15,
        linePaymentAmount: 45
      }
    ]
  },
  {
    id: 33,
    schedulerId: 1737,
    doctorId: 21,
    doctorName: 'Dr. Reem Sherif',
    roomId: 1,
    roomName: 'Laser Room 1',
    clinicBranchId: 5,
    clinicBranchName: 'Heliopolis',
    billingDate: '2026-08-10',
    totalHoursWorked: 1,
    hourlyRateApplied: 10,
    hourlyPaymentAmount: 10,
    totalPulses: 146,
    pulseRateApplied: 1,
    pulsePaymentAmount: 146,
    totalServicesCount: 1,
    servicePaymentAmount: 20,
    totalPaymentAmount: 176,
    paymentStatus: 'PENDING',
    paidAt: null,
    paidByUsername: null,
    serviceLines: [
      {
        id: 330,
        patientServiceId: 72,
        serviceName: 'Full leg',
        serviceCount: 1,
        serviceCostApplied: null,
        materialCostApplied: null,
        doctorPercentageApplied: null,
        fixedFeeApplied: 20,
        linePaymentAmount: 20
      }
    ]
  }
];