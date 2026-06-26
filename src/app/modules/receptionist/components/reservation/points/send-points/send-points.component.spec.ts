import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPointsComponent } from './send-points.component';

describe('SendPointsComponent', () => {
  let component: SendPointsComponent;
  let fixture: ComponentFixture<SendPointsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [SendPointsComponent]
});
    fixture = TestBed.createComponent(SendPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
