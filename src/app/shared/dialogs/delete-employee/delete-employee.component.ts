import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';

import { Employee } from '../../models/employee.model';

// import { deleteEmployee } from './state/employee.actions';

@Component({
  selector: 'app-delete-employee',
  templateUrl: './delete-employee.component.html',
})
export class DeleteEmployeeComponent {
  // isDeleteEmployeeModalOpen = false;
  // employeeToDelete: Employee | null = null;
  _isDeleteEmployeeModalOpen = false;

  @Input()
  set isDeleteEmployeeModalOpen(value: boolean) {
    this._isDeleteEmployeeModalOpen = value;
    if (!value) {
      this.closeDialog();
    }
  }
  get isDeleteEmployeeModalOpen(): boolean {
    return this._isDeleteEmployeeModalOpen;
  }

  // @Input() isDeleteEmployeeModalOpen = false;
  @Input() employeeToDelete: Employee | null = null;
  @Output() closeDeleteEmployeeModal = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<Employee>();

  constructor(private store: Store) {}

  closeDialog() {
    this.closeDeleteEmployeeModal.emit();
  }

  confirmDeleteEmp() {
    if (this.employeeToDelete) {
      this.confirmDelete.emit(this.employeeToDelete); // Emit the employee to be deleted
    }
  }

  // closeDeleteEmployeeModal() {
  //   this.isDeleteEmployeeModalOpen = false;
  // }

  // onDeleteEmployee() {
  //   if (this.employeeToDelete) {
  //     this.store.dispatch(deleteEmployee({ employeeId: this.employeeToDelete.employeeId }));
  //     this.closeDeleteEmployeeModal();
  //   }
  // }
}
