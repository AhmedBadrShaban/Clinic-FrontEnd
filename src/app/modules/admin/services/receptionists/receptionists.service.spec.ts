import { TestBed } from '@angular/core/testing';

import { ReceptionistsService } from './receptionists.service';

describe('ReceptionistsService', () => {
  let service: ReceptionistsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceptionistsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
