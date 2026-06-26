import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionistsComponent } from './receptionists.component';

describe('ReceptionistsComponent', () => {
  let component: ReceptionistsComponent;
  let fixture: ComponentFixture<ReceptionistsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceptionistsComponent]
    });
    fixture = TestBed.createComponent(ReceptionistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
