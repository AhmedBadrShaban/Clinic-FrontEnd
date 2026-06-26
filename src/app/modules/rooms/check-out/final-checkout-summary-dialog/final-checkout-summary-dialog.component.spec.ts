/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FinalCheckoutSummaryDialogComponent } from './final-checkout-summary-dialog.component';

describe('FinalCheckoutSummaryDialogComponent', () => {
  let component: FinalCheckoutSummaryDialogComponent;
  let fixture: ComponentFixture<FinalCheckoutSummaryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [FinalCheckoutSummaryDialogComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalCheckoutSummaryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
