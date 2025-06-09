import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstarintsPopupComponent } from './constarints-popup.component';

describe('ConstarintsPopupComponent', () => {
  let component: ConstarintsPopupComponent;
  let fixture: ComponentFixture<ConstarintsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstarintsPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstarintsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
