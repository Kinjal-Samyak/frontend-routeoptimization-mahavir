import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopsHistoryComponent } from './stops-history.component';

describe('StopsHistoryComponent', () => {
  let component: StopsHistoryComponent;
  let fixture: ComponentFixture<StopsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StopsHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StopsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
