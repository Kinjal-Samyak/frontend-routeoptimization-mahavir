import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicRouteComponent } from './dynamic-route.component';

describe('DynamicRouteComponent', () => {
  let component: DynamicRouteComponent;
  let fixture: ComponentFixture<DynamicRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
