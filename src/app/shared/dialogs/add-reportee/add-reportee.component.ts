import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Employee } from '../../models/employee.model';
import { DesignationDataService } from '../../services/designation-data.service';

// import { addReportee } from './state/employee.actions';

@Component({
  selector: 'app-add-reportee',
  templateUrl: './add-reportee.component.html',
})
export class AddReporteeComponent {
  _isAddReporteeModalOpen = false;

  @Input()
  set isAddReporteeModalOpen(value: boolean) {
    this._isAddReporteeModalOpen = value;
    if (!value) {
      this.closeDialog();
    }
  }
  get isAddReporteeModalOpen(): boolean {
    return this._isAddReporteeModalOpen;
  }

  @Input() isEditMode = false;
  @Input() employeeToEdit: Employee | null = null;

  @Input() manager: Employee | null = null;

  @Output() closeAddReporteeModal = new EventEmitter<void>();
  @Output() saveReportee = new EventEmitter<Employee>();

  addReporteeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    public _designationDataService: DesignationDataService
  ) {
    this.addReporteeForm = this.fb.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      email: ['', [Validators.email]],
      phoneNumber: ['', [Validators.pattern(/^\d{10}$/)]],
    });
  }
  // React to changes in `employeeToEdit` and populate the form in Edit Mode
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.manager);
    if (changes['employeeToEdit'] && this.employeeToEdit) {
      this.addReporteeForm.patchValue({
        name: this.employeeToEdit.name,
        designation: this.employeeToEdit.designation,
        email: this.employeeToEdit.email,
        phoneNumber: this.employeeToEdit.phoneNumber,
      });
    }
  }
  // Close Modal
  closeDialog() {
    this.closeAddReporteeModal.emit();
  }

  // Save Reportee
  submit() {
    if (this.addReporteeForm.valid) {
      this.saveReportee.emit(this.addReporteeForm.value);
    }
  }
  // closeAddReporteeModal() {
  //   this.isAddReporteeModalOpen = false;
  // }

  // onAddReportee() {
  //   if (this.addReporteeForm.valid) {
  //     this.store.dispatch(addReportee({ reportee: this.addReporteeForm.value }));
  //     this.closeAddReporteeModal();
  //   }
  // }
}
