import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewReceptionistComponent } from './add-new-receptionist.component';

describe('AddNewReceptionistComponent', () => {
  let component: AddNewReceptionistComponent;
  let fixture: ComponentFixture<AddNewReceptionistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [AddNewReceptionistComponent]
});
    fixture = TestBed.createComponent(AddNewReceptionistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
