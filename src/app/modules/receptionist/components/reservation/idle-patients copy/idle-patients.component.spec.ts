import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdlePatientsComponent } from './idle-patients.component';

describe('IdlePatientsComponent', () => {
  let component: IdlePatientsComponent;
  let fixture: ComponentFixture<IdlePatientsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdlePatientsComponent]
    });
    fixture = TestBed.createComponent(IdlePatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
