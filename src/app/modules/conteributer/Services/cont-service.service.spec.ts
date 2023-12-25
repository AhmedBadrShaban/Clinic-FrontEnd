import { TestBed } from '@angular/core/testing';

import { ContServiceService } from './cont-service.service';

describe('ContServiceService', () => {
  let service: ContServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
