import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapHistoryComponent } from './map-history.component';

describe('MapHistoryComponent', () => {
  let component: MapHistoryComponent;
  let fixture: ComponentFixture<MapHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
