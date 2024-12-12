import { createFeatureSelector, createSelector } from '@ngrx/store';

import { EmployeeState } from './employee.reducer';

// Feature selector for the employee state
export const selectEmployeeState =
  createFeatureSelector<EmployeeState>('employees');

// Select all employees
export const selectAllEmployees = createSelector(
  selectEmployeeState,
  (state) => state.employees
);

// Select employee by ID
export const selectEmployeeById = (employeeId: string) =>
  createSelector(selectAllEmployees, (employees) =>
    employees.find((employee) => employee.employeeId === employeeId)
  );

// Select employees who are managers
export const selectManagers = createSelector(selectAllEmployees, (employees) =>
  employees.filter((employee) => employee.isManager)
);
