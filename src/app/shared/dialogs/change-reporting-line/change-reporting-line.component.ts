import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectAllEmployees } from 'src/app/core/store/employee.selectors';

import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-change-reporting-line',
  templateUrl: './change-reporting-line.component.html',
})
export class ChangeReportingLineComponent {
  _isChangeReportingLineModalOpen = false;

  @Input()
  set isChangeReportingLineModalOpen(value: boolean) {
    this._isChangeReportingLineModalOpen = value;
    if (!value) {
      this.closeDialog();
    }
  }
  get isChangeReportingLineModalOpen(): boolean {
    return this._isChangeReportingLineModalOpen;
  }
  @Input() employeeToChangeReportingLine: Employee | null = null;
  @Output() closeChangeReportingLineModal = new EventEmitter<void>();
  @Output() saveNewManager = new EventEmitter<Employee>();

  changeReportingLineForm: FormGroup;
  managers: Employee[] = [];

  constructor(private fb: FormBuilder, private store: Store) {
    console.log(this.employeeToChangeReportingLine);
    this.changeReportingLineForm = this.fb.group({
      newManager: ['', Validators.required], // Required field for new manager
    });
  }
  ngOnInit() {
    // Load all employees (potential managers) from the store
    this.store.select(selectAllEmployees).subscribe((employees) => {
      // Exclude the current employee's existing manager from the list
      this.managers = employees.filter(
        (emp) =>
          emp.employeeId !== this.employeeToChangeReportingLine?.employeeId && // Exclude the current employee
          emp.employeeId !== this.employeeToChangeReportingLine?.managerId // Exclude the current manager
      );
    });
  }
  closeDialog() {
    console.log('close dialog');
    this.closeChangeReportingLineModal.emit();
  }

  submit() {
    if (this.changeReportingLineForm.valid) {
      const newManager = this.managers.find(
        (manager) =>
          manager.employeeId === this.changeReportingLineForm.value.newManager
      );
      console.log(newManager);
      if (newManager) {
        this.saveNewManager.emit(newManager); // Emit the new manager data
      }
    }
  }
  ngOnDestroy() {
    console.log('Component Destroyed');
  }
}
