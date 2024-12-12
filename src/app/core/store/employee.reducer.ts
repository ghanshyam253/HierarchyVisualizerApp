import { createReducer, on } from '@ngrx/store';
import { Employee } from 'src/app/shared/models/employee.model';

import {
  addReportee,
  changeReportingLine,
  deleteEmployee,
  loadEmployees,
  toggleAllEmployees,
  updateEmployee,
} from './employee.actions';

const employeestest: Employee[] = [
  {
    employeeId: '1',
    name: 'John Doe',
    designation: 'CEO',
    email: 'john.doe@example.com',
    phoneNumber: '1234567890',
    managerName: '',
    managerId: '',
    selected: false,
  },
  {
    employeeId: '100',
    name: 'Sam Curran',
    designation: 'HEAD_SALES',
    email: 'john.doe@example.com',
    phoneNumber: '1234567890',
    managerName: 'John Doe',
    managerId: '1',
    selected: false,
  },
  {
    employeeId: '10',
    name: 'Sam Tom',
    designation: 'HEAD_SALES',
    email: 'sam.curran@example.com',
    phoneNumber: '1234567890',
    managerName: 'John Doe',
    managerId: '1',
    selected: false,
  },
  {
    employeeId: '25',
    name: 'Alice Johnson',
    designation: 'ENG_MGR',
    email: 'alice.johnson@example.com',
    phoneNumber: '0987654321',
    managerName: 'Sam Tom',
    managerId: '10',
    selected: false,
  },
  {
    employeeId: '6',
    name: 'Michael Lee',
    designation: 'DEVOPS_ENG',
    email: 'michael.lee@example.com',
    phoneNumber: '1122334455',
    managerName: 'Sam Tom',
    managerId: '10',
    selected: false,
  },
  {
    employeeId: '4',
    name: 'Rachel Green',
    designation: 'UX_DES',
    email: 'rachel.green@example.com',
    phoneNumber: '2233445566',
    managerName: 'Alice Johnson',
    managerId: '25',
    selected: false,
  },
  {
    employeeId: '5',
    name: 'James Taylor',
    designation: 'SALES_EXEC',
    email: 'james.taylor@example.com',
    phoneNumber: '3344556677',
    managerName: 'Alice Johnson',
    managerId: '25',
    selected: false,
  },
];

export interface State {
  employees: Employee[];
}

export interface EmployeeState {
  employees: Employee[];
}

// // Data for testing
// const initialState: EmployeeState = {
//   employees: [...employeestest], // Initialize with an empty list or a predefined list of employees
// };
const initialState: EmployeeState = {
  employees: [], // Initialize with an empty list or a predefined list of employees
};

export const employeeReducer = createReducer(
  initialState,
  // Load Reportee
  on(loadEmployees, (state, { employees }) => ({
    ...state,
    employees: [...employees],
  })),

  // Add Reportee
  on(addReportee, (state, { reportee }) => ({
    ...state,
    employees: [...state.employees, { ...reportee, employeeId: generateId() }], // Add unique ID
  })),

  // Update Employee
  on(updateEmployee, (state, { employee }) => ({
    ...state,
    employees: state.employees.map((emp) =>
      emp.employeeId === employee.employeeId ? { ...emp, ...employee } : emp
    ),
  })),

  // Delete Employee
  on(deleteEmployee, (state, { employeeId }) => {
    const employeeToDelete = state.employees.find(
      (emp) => emp.employeeId === employeeId
    );
    if (!employeeToDelete) return state;

    const updatedEmployees = state.employees
      .filter((emp) => emp.employeeId !== employeeId) // Remove the employee
      .map(
        (emp) =>
          emp.managerId === employeeId
            ? { ...emp, managerId: employeeToDelete.managerId }
            : emp // Reassign reportees
      );

    return { ...state, employees: updatedEmployees };
  }),

  // Change Reporting Line
  on(
    changeReportingLine,
    (state, { employeeId, newManagerId, newManagerName }) => ({
      ...state,
      employees: state.employees.map((emp) =>
        emp.employeeId === employeeId
          ? { ...emp, managerId: newManagerId, managerName: newManagerName }
          : emp
      ),
    })
  ),

  on(toggleAllEmployees, (state, { isChecked }) => ({
    ...state,
    employees: state.employees.map((emp) => ({ ...emp, selected: isChecked })),
  }))
);

// Utility function to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
