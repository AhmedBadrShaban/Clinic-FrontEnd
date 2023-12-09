import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEventComponent } from './dialog-event.component';

describe('DialogEventComponent', () => {
  let component: DialogEventComponent;
  let fixture: ComponentFixture<DialogEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogEventComponent]
    });
    fixture = TestBed.createComponent(DialogEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
