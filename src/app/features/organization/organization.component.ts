import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllEmployees } from 'src/app/core/store/employee.selectors';
import { Employee } from 'src/app/shared/models/employee.model';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent {
  employees: Employee[] = [];
  navLevel = 1;
  constructor(private store: Store) {}
  selectedView: string = 'GRID_VIEW';
  ngOnInit() {
    // Fetch all employees
    this.store.select(selectAllEmployees).subscribe((employeesFromStore) => {
      console.log('ALL EMP FROM STORE : ', employeesFromStore);
      this.employees = employeesFromStore;
    });
  }
}
