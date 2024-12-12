import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { debounceTime, fromEvent } from 'rxjs';
import {
  addReportee,
  changeReportingLine,
  deleteEmployee,
  toggleAllEmployees,
  updateEmployee,
} from 'src/app/core/store/employee.actions';
import { Employee } from 'src/app/shared/models/employee.model';
import { DesignationDataService } from 'src/app/shared/services/designation-data.service';

@Component({
  selector: 'app-grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridViewComponent {
  isAddReporteeDialogOpen = false;
  isDeleteEmployeeDialogOpen = false; // For controlling delete modal visibility
  isChangeReportingLineDialogOpen = false; // Control visibility of Change Reporting Line dialog

  employeeToDelete: Employee | null = null; // Employee to be deleted
  employeeToChangeReportingLine: Employee | null = null; // Employee for Change Reporting Line

  selectedManager: Employee | null = null;
  employeeToEdit: Employee | null = null; // Holds the employee being edited
  isEditMode = false; // Determines if the dialog is in Edit Mode

  showToast = false; // Controls toast visibility
  toastTitle = '';
  toastMessage = '';
  @Input() employees: Employee[] = [];
  designationMapping: { [key: string]: string } = {}; // Explicitly typed as a string-to-string map

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

  selectedEmployees: any[] = [];

  // Open Edit Dialog
  openEditDialog(employee: Employee) {
    this.employeeToEdit = employee;
    this.isEditMode = true; // Enable Edit Mode
    this.isAddReporteeDialogOpen = true;
  }

  viewDetails(employee: any) {
    console.log('View details for:', employee);
    // Logic to view employee details
  }
  openDeleteDialog(employee: Employee) {
    this.employeeToDelete = employee;

    // Check if employee has reportees
    const reportees = this.employees.filter(
      (emp) => emp.managerId === this.employeeToDelete?.employeeId
    );

    // Handle case where employee has reportees but no manager
    if (reportees.length > 0 && !employee.managerId) {
      this.showToast = true;
      this.toastTitle = 'Error';
      this.toastMessage = `Cannot delete employee ${employee.name} directly as there is no manager to reassign their reportees. Please assign a manager to this employee before attempting to delete them.`;
      return;
    }

    // If no reportees or reportees can be reassigned, open delete confirmation dialog
    this.isDeleteEmployeeDialogOpen = true;
  }

  closeDeleteEmployeeDialog() {
    this.isDeleteEmployeeDialogOpen = false;
    this.employeeToDelete = null;
  }

  // Open Add Reportee Modal
  openAddReporteeDialog(manager: Employee) {
    this.selectedManager = manager;
    this.isAddReporteeDialogOpen = true;
  }

  // Close the dialog
  closeAddReporteeDialog() {
    this.isAddReporteeDialogOpen = false;
    this.selectedManager = null;
    this.employeeToEdit = null;
  }

  // Save a new reportee or edited employee
  onSaveReportee(employee: Employee) {
    if (this.isEditMode && this.employeeToEdit) {
      // Dispatch action to update employee
      const updatedEmployee = { ...this.employeeToEdit, ...employee };
      this.store.dispatch(updateEmployee({ employee: updatedEmployee }));
    } else if (this.selectedManager) {
      // Dispatch action to add reportee
      const newReportee = {
        ...employee,
        managerId: this.selectedManager.employeeId,
        managerName: this.selectedManager.name,
      };
      this.store.dispatch(addReportee({ reportee: newReportee }));
    }
    this.closeAddReporteeDialog();
  }
  onDeleteEmployee(employee: Employee) {
    if (!this.employeeToDelete) {
      return;
    }

    const employeeToDelete = this.employeeToDelete;

    // Find direct reportees of the employee
    const reportees = this.employees.filter(
      (emp) => emp.managerId === employeeToDelete.employeeId
    );

    // If the employee has reportees
    if (reportees.length > 0) {
      // Reassign all reportees to the employee's manager
      reportees.forEach((reportee) => {
        const updatedReportee = {
          ...reportee,
          managerId: employee.managerId,
          managerName: employee.managerName,
        };
        this.store.dispatch(updateEmployee({ employee: updatedReportee }));
      });
    }

    // Proceed with deleting the employee
    this.store.dispatch(deleteEmployee({ employeeId: employee.employeeId }));
    this.closeDeleteEmployeeDialog();
  }

  // Method to reset the toast message visibility
  resetToast() {
    this.showToast = false;
  }

  openChangeReportingLineDialog(employee: Employee) {
    this.employeeToChangeReportingLine = employee;
    this.isChangeReportingLineDialogOpen = true;
  }
  closeChangeReportingLineDialog() {
    this.isChangeReportingLineDialogOpen = false;
    this.employeeToChangeReportingLine = null;
  }

  // Handle changing the reporting line (changing the manager of an employee)
  onChangeReportingLine(newManager: Employee) {
    if (this.employeeToChangeReportingLine) {
      const subordinates = this.getSubordinates(
        this.employeeToChangeReportingLine.employeeId
      );
      const isCycle = subordinates.some(
        (sub) => sub.employeeId === newManager.employeeId
      );

      if (isCycle) {
        this.showToast = true;
        this.toastTitle = 'Error';
        this.toastMessage = `Cannot assign ${newManager.name} as the new manager because they are a subordinate of ${this.employeeToChangeReportingLine.name}.`;
        this.closeChangeReportingLineDialog(); // Close the dialog after updating

        return;
      }

      console.log(newManager);
      const updatedEmployee = {
        ...this.employeeToChangeReportingLine,
        managerId: newManager.employeeId,
        managerName: newManager.name,
      };
      console.log(updatedEmployee);
      console.log('newManager');
      console.log({
        employeeId: this.employeeToChangeReportingLine.employeeId,
        newManagerId: newManager.employeeId,
        newManagerName: newManager.name,
      });
      this.store.dispatch(
        changeReportingLine({
          employeeId: this.employeeToChangeReportingLine.employeeId,
          newManagerId: newManager.employeeId,
          newManagerName: newManager.name,
        })
      );
      this.closeChangeReportingLineDialog(); // Close the dialog after updating
    }
  }

  addFirstEmpployee() {
    const noEmp: Employee = {
      employeeId: '', // or an appropriate default value
      name: '',
      designation: '',
      email: '',
    };

    this.openAddReporteeDialog(noEmp);
  }

  private getSubordinates(employeeId: string): Employee[] {
    const subordinates = this.employees.filter(
      (emp) => emp.managerId === employeeId
    );

    // Recursively gather all subordinates of each subordinate
    return subordinates.reduce((acc, subordinate) => {
      return acc.concat(
        subordinate,
        this.getSubordinates(subordinate.employeeId)
      );
    }, [] as Employee[]);
  }
}
