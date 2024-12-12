import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import { addReportee, deleteEmployee, updateEmployee } from './employee.actions';
import { State } from './employee.reducer';

@Injectable()
export class EmployeeEffects {
  constructor(private actions$: Actions, private store: Store<State>) {}

  // Save state to localStorage when actions like add/update/delete employees are dispatched
  saveEmployeesToLocalStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addReportee, updateEmployee, deleteEmployee),
        tap(() => {
          // Dispatch an action to load employees into localStorage
          this.store.select('employees').subscribe((employees) => {
            localStorage.setItem('employees', JSON.stringify(employees));
          });
        })
      ),
    { dispatch: false }
  );
}
