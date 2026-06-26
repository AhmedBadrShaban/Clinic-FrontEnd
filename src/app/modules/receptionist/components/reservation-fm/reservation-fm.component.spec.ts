import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationFmComponent } from './reservation-fm.component';

describe('ReservationFmComponent', () => {
  let component: ReservationFmComponent;
  let fixture: ComponentFixture<ReservationFmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ReservationFmComponent]
});
    fixture = TestBed.createComponent(ReservationFmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
