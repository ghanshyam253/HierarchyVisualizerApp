import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule, ClrIconModule } from '@clr/angular';

import { AddReporteeComponent } from './dialogs/add-reportee/add-reportee.component';
import { ChangeReportingLineComponent } from './dialogs/change-reporting-line/change-reporting-line.component';
import { DeleteEmployeeComponent } from './dialogs/delete-employee/delete-employee.component';

@NgModule({
  declarations: [
    AddReporteeComponent,
    DeleteEmployeeComponent,
    ChangeReportingLineComponent,
  ],
  imports: [
    ClrIconModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  exports: [
    AddReporteeComponent,
    DeleteEmployeeComponent,
    ChangeReportingLineComponent,
  ],
})
export class SharedModule {}
