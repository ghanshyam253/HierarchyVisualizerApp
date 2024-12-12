import { createAction, props } from '@ngrx/store';
import { Employee } from 'src/app/shared/models/employee.model';

// import { Employee } from '../models/employee.model';

// Add a new reportee
export const addReportee = createAction(
  '[Employee] Add Reportee',
  props<{ reportee: Employee }>()
);

// Update employee details
export const updateEmployee = createAction(
  '[Employee] Update Employee',
  props<{ employee: Employee }>()
);

// Delete an employee
export const deleteEmployee = createAction(
  '[Employee] Delete Employee',
  props<{ employeeId: string }>()
);

// Change reporting line
export const changeReportingLine = createAction(
  '[Employee] Change Reporting Line',
  props<{ employeeId: string; newManagerId: string; newManagerName: string }>()
);

export const loadEmployees = createAction(
  '[Employee] Load Employees',
  props<{ employees: Employee[] }>()
);

export const toggleAllEmployees = createAction(
  '[Employee] Toggle All Employees',
  props<{ isChecked: boolean }>()
);
