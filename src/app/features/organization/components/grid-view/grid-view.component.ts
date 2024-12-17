import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { debounceTime, fromEvent } from 'rxjs';
import { toggleAllEmployees } from 'src/app/core/store/employee.actions';
import { Employee } from 'src/app/shared/models/employee.model';
import { DesignationDataService } from 'src/app/shared/services/designation-data.service';

import { CommonTemplatesActionsComponent } from '../common-templates-actions/common-templates-actions.component';

@Component({
  selector: 'app-grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridViewComponent {
  selectedEmployees: any[] = [];

  @Input() employees: Employee[] = [];
  designationMapping: { [key: string]: string } = {}; // Explicitly typed as a string-to-string map

  @ViewChild(CommonTemplatesActionsComponent)
  commonTemplatesActionsComponent!: CommonTemplatesActionsComponent;

  constructor(
    private store: Store,
    public _designationDataService: DesignationDataService
  ) {}

  ngOnInit() {
    // Fetch the designations list from the service
    this.designationMapping =
      this._designationDataService.getDesignationsMapping();
  }

  get isAllSelected(): boolean {
    return this.employees.every((employee) => employee.selected);
  }

  get isIndeterminate(): boolean {
    const selectedCount = this.employees.filter(
      (employee) => employee.selected
    ).length;
    return selectedCount > 0 && selectedCount < this.employees.length;
  }

  toggleSelectAll(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      fromEvent(target, 'change')
        .pipe(debounceTime(200))
        .subscribe(() => {
          const isChecked = target.checked;
          this.store.dispatch(toggleAllEmployees({ isChecked }));
        });
    }
  }

  onRowCheckboxChange(employee: Employee): void {
    // Update the employees array immutably
    this.employees = this.employees.map(
      (emp) =>
        emp.employeeId === employee.employeeId
          ? { ...emp, selected: !emp.selected } // Update the selected property for the matching employee
          : emp // Leave others unchanged
    );
  }
}
