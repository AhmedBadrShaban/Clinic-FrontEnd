import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConteributerComponent } from './conteributer.component';

describe('ConteributerComponent', () => {
  let component: ConteributerComponent;
  let fixture: ComponentFixture<ConteributerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConteributerComponent]
    });
    fixture = TestBed.createComponent(ConteributerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
