export interface Employee {
  employeeId: string;
  name: string;
  designation: string;
  email: string;
  phoneNumber?: string;
  managerName?: string;
  managerId?: string; // Optional property for reporting to a manager
  selected?: boolean; // Tracks if the employee is selected (for UI purposes)
  isManager?: boolean; // Indicates if the employee is a manager
}
