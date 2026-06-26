import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsComponent } from './materials.component';

describe('MaterialsComponent', () => {
  let component: MaterialsComponent;
  let fixture: ComponentFixture<MaterialsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [MaterialsComponent]
});
    fixture = TestBed.createComponent(MaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
