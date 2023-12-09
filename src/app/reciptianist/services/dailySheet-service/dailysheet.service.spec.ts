import { TestBed } from '@angular/core/testing';

import { DailysheetService } from './dailysheet.service';

describe('DailysheetService', () => {
  let service: DailysheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailysheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
