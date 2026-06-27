/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DebitReportsService } from './debit-reports.service';

describe('Service: DebitReports', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DebitReportsService]
    });
  });

  it('should ...', inject([DebitReportsService], (service: DebitReportsService) => {
    expect(service).toBeTruthy();
  }));
});
