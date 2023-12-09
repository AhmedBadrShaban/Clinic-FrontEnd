import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverSheetComponent } from './cover-sheet.component';

describe('CoverSheetComponent', () => {
  let component: CoverSheetComponent;
  let fixture: ComponentFixture<CoverSheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoverSheetComponent]
    });
    fixture = TestBed.createComponent(CoverSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
