import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarContComponent } from './nav-bar-cont.component';

describe('NavBarContComponent', () => {
  let component: NavBarContComponent;
  let fixture: ComponentFixture<NavBarContComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [NavBarContComponent]
});
    fixture = TestBed.createComponent(NavBarContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
