import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationHomePageComponent } from './reservation-home-page.component';

describe('ReservationHomePageComponent', () => {
  let component: ReservationHomePageComponent;
  let fixture: ComponentFixture<ReservationHomePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationHomePageComponent]
    });
    fixture = TestBed.createComponent(ReservationHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
