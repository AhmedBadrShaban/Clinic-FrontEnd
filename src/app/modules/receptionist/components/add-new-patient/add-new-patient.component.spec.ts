import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPatientComponent } from './add-new-patient.component';

describe('AddNewPatientComponent', () => {
  let component: AddNewPatientComponent;
  let fixture: ComponentFixture<AddNewPatientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewPatientComponent]
    });
    fixture = TestBed.createComponent(AddNewPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
