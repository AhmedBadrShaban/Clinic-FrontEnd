import { TestBed } from '@angular/core/testing';

import { CoverSheetService } from './cover-sheet.service';

describe('CoverSheetService', () => {
  let service: CoverSheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoverSheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
