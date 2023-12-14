import { TestBed } from '@angular/core/testing';

import { ReservationfmService } from './reservationfm.service';

describe('ReservationfmService', () => {
  let service: ReservationfmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationfmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
