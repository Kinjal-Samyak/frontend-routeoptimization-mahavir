import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingScreenComponent } from './tracking-screen.component';

describe('TrackingScreenComponent', () => {
  let component: TrackingScreenComponent;
  let fixture: ComponentFixture<TrackingScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
