import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewMatrialComponent } from './add-new-matrial.component';

describe('AddNewMatrialComponent', () => {
  let component: AddNewMatrialComponent;
  let fixture: ComponentFixture<AddNewMatrialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewMatrialComponent]
    });
    fixture = TestBed.createComponent(AddNewMatrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
