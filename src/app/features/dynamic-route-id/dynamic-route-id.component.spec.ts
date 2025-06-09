import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicRouteIdComponent } from './dynamic-route-id.component';

describe('DynamicRouteIdComponent', () => {
  let component: DynamicRouteIdComponent;
  let fixture: ComponentFixture<DynamicRouteIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicRouteIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicRouteIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
