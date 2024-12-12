import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { loadEmployees } from './core/store/employee.actions';
import { Employee } from './shared/models/employee.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'HierarchyVisualizer';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.loadDataFromLocalStorage();
  }
  loadDataFromLocalStorage() {
    // Load employees from localStorage if available
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      try {
        const employees: Employee[] = JSON.parse(savedEmployees)?.employees;
        if (Array.isArray(employees)) {
          // Dispatch the action to load employees into the store
          this.store.dispatch(loadEmployees({ employees }));
        } else {
          console.error('Loaded data is not an array:', savedEmployees);
        }
      } catch (error) {
        console.error('Error parsing employees from localStorage:', error);
      }
    }
  }
}
