import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonTemplatesActionsComponent } from './common-templates-actions.component';

describe('CommonTemplatesComponent', () => {
  let component: CommonTemplatesActionsComponent;
  let fixture: ComponentFixture<CommonTemplatesActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommonTemplatesActionsComponent],
    });
    fixture = TestBed.createComponent(CommonTemplatesActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
