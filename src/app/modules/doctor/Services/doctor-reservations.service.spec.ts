import { TestBed } from '@angular/core/testing';

import { DoctorReservationsService } from './doctor-reservations.service';

describe('DoctorReservationsService', () => {
  let service: DoctorReservationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorReservationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
