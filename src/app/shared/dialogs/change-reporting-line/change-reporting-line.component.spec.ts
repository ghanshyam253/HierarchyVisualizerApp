import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeReportingLineComponent } from './change-reporting-line.component';

describe('ChangeReportingLineComponent', () => {
  let component: ChangeReportingLineComponent;
  let fixture: ComponentFixture<ChangeReportingLineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeReportingLineComponent],
    });
    fixture = TestBed.createComponent(ChangeReportingLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
