import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsBarComponent } from './events-bar.component';

describe('EventsBarComponent', () => {
  let component: EventsBarComponent;
  let fixture: ComponentFixture<EventsBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventsBarComponent]
    });
    fixture = TestBed.createComponent(EventsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
