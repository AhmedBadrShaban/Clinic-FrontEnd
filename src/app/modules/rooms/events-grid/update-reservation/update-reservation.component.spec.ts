import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateReservationComponent } from './update-reservation.component';

describe('UpdateReservationComponent', () => {
  let component: UpdateReservationComponent;
  let fixture: ComponentFixture<UpdateReservationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateReservationComponent]
    });
    fixture = TestBed.createComponent(UpdateReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
