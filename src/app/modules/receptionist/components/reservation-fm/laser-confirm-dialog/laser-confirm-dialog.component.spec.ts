/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LaserConfirmDialogComponent } from './laser-confirm-dialog.component';

describe('LaserConfirmDialogComponent', () => {
  let component: LaserConfirmDialogComponent;
  let fixture: ComponentFixture<LaserConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [LaserConfirmDialogComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaserConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
