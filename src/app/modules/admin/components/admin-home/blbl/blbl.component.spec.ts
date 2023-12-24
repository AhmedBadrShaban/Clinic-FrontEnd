import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlblComponent } from './blbl.component';

describe('BlblComponent', () => {
  let component: BlblComponent;
  let fixture: ComponentFixture<BlblComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlblComponent]
    });
    fixture = TestBed.createComponent(BlblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
