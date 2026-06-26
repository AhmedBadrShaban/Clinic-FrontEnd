import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailySheetComponent } from './daily-sheet.component';

describe('DailySheetComponent', () => {
  let component: DailySheetComponent;
  let fixture: ComponentFixture<DailySheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [DailySheetComponent]
});
    fixture = TestBed.createComponent(DailySheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
