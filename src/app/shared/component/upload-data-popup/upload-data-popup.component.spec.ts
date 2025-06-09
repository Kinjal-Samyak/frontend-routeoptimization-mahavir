import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDataPopupComponent } from './upload-data-popup.component';

describe('UploadDataPopupComponent', () => {
  let component: UploadDataPopupComponent;
  let fixture: ComponentFixture<UploadDataPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadDataPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDataPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
