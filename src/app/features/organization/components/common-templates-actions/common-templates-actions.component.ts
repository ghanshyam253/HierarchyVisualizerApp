import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addReportee,
  changeReportingLine,
  deleteEmployee,
  updateEmployee,
} from 'src/app/core/store/employee.actions';
import { Employee } from 'src/app/shared/models/employee.model';

@Component({
  selector: 'app-common-templates-actions',
  templateUrl: './common-templates-actions.component.html',
  styleUrls: ['./common-templates-actions.component.scss'],
})
export class CommonTemplatesActionsComponent {
  // Open Add Reportee Modal
  @Input() employees: Employee[] = [];

  selectedManager: Employee | null = null;
  employeeToDelete: Employee | null = null; // Employee to be deleted
  employeeToChangeReportingLine: Employee | null = null; // Employee for Change Reporting Line
  isAddReporteeDialogOpen = false;
  employeeToEdit: Employee | null = null; // Holds the employee being edited
  isDeleteEmployeeDialogOpen = false; // For controlling delete modal visibility
  isEditMode = false; // Determines if the dialog is in Edit Mode
  isChangeReportingLineDialogOpen = false; // Control visibility of Change Reporting Line dialog

  showToast = false; // Controls toast visibility
  toastTitle = '';
  toastMessage = '';

  constructor(private store: Store) {}

  ngOnInit() {}

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

  // Open Edit Dialog
  openEditDialog(employee: Employee) {
    this.employeeToEdit = employee;
    this.isEditMode = true; // Enable Edit Mode
    this.isAddReporteeDialogOpen = true;
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
}
