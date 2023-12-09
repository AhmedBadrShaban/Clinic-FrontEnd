import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReceptionistHomeComponent} from './receptionist-home.component';

describe('ReceptionistHomeComponent', () => {
  let component: ReceptionistHomeComponent;
  let fixture: ComponentFixture<ReceptionistHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceptionistHomeComponent]
    });
    fixture = TestBed.createComponent(ReceptionistHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
