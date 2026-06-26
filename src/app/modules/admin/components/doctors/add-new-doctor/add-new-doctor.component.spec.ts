import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewDoctorComponent } from './add-new-doctor.component';

describe('AddNewDoctorComponent', () => {
  let component: AddNewDoctorComponent;
  let fixture: ComponentFixture<AddNewDoctorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [AddNewDoctorComponent]
});
    fixture = TestBed.createComponent(AddNewDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
