import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReporteeComponent } from './add-reportee.component';

describe('AddReporteeComponent', () => {
  let component: AddReporteeComponent;
  let fixture: ComponentFixture<AddReporteeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddReporteeComponent],
    });
    fixture = TestBed.createComponent(AddReporteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
