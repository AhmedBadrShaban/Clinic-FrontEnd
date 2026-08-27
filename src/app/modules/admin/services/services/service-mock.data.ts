import { Service } from '../../models/service';

export const MOCK_SERVICES_PAGE = {
  data: [
    {
      patientServiceId: 2,
      serviceName: 'Bikini + line',
      costPerSession: 250.0,
      isActive: true,
      fixedDoctorFee: null,
      materialCost: 50.0,
      doctorPercentage: 0.1,
      rooms: [{ roomId: 1, roomName: 'Laser Room 1' }]
    },
    {
      patientServiceId: 3,
      serviceName: 'Under arms',
      costPerSession: 120.0,
      isActive: true,
      fixedDoctorFee: 20.0,
      materialCost: null,
      doctorPercentage: null,
      rooms: [{ roomId: 1, roomName: 'Laser Room 1' }, { roomId: 2, roomName: 'Laser Room 2' }]
    },
    {
      patientServiceId: 4,
      serviceName: 'Full body laser',
      costPerSession: 500.0,
      isActive: true,
      fixedDoctorFee: null,
      materialCost: null,
      doctorPercentage: null,
      rooms: [{ roomId: 2, roomName: 'Laser Room 2' }]
    }
  ],
  currentPage: 0,
  totalItems: 106,
  totalPages: 6
};

export const MOCK_ROOMS_NAMES: string[] = [
  'Laser Room 1',
  'Laser Room 2',
  'Laser Room 3'
];

export const mockServicesList: Service[] = MOCK_SERVICES_PAGE.data as unknown as Service[];
