import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicRouteMapComponent } from './dynamic-route-map.component';

describe('DynamicRouteMapComponent', () => {
  let component: DynamicRouteMapComponent;
  let fixture: ComponentFixture<DynamicRouteMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicRouteMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicRouteMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
