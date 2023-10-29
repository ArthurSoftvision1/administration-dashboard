import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError, take } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { EmployeesService } from '../employees.service';
import { getEmployeesData, getEmployeesFailure, getEmployeesSuccess, getShiftsFailure, getShiftsSuccess, updateEmployeeName, updateEmployeeNameFailure, updateEmployeeNameSuccess } from './employee.actions';
import { Store } from '@ngrx/store';
import { selectEmployees } from './employee.selectors';

@Injectable()
export class EmployeeEffects {
  constructor(private actions$: Actions, private employeesService: EmployeesService, private store: Store) { }

  getEmployeesData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getEmployeesData),
      mergeMap(() =>
        forkJoin([
          this.employeesService.getEmployees(),
          this.employeesService.getShifts()
        ]).pipe(
          map(([employees, shifts]) => ({
            employees,
            shifts
          })),
          catchError(() => {
            // Handle the error and dispatch failure actions
            return of({
              employees: [],
              shifts: []
            });
          })
        )
      ),
      mergeMap((result) => {
        if (result.employees.length > 0 && result.shifts.length > 0) {
          // Both employees and shifts are available, dispatch success actions
          return [
            getEmployeesSuccess({ employees: result.employees }),
            getShiftsSuccess({ shifts: result.shifts })
          ];
        } else {
          // At least one of them is empty, dispatch failure actions
          return [
            getEmployeesFailure({ error: 'An error occurred while fetching employees', employees: [] }),
            getShiftsFailure({ error: 'An error occurred while fetching shifts', shifts: [] })
          ];
        }
      })
    );
  });

  updateEmployeeName$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateEmployeeName),
      mergeMap((action: { id: string; name: string }) => {
        return this.store.select(selectEmployees).pipe(
          take(1),
          map((employees) => {
            const employeeToUpdate = employees.find((e) => e.id === action.id);

            if (employeeToUpdate) {
              // Make changes to the employee
              const updatedEmployee = { ...employeeToUpdate, name: action.name };

              // Dispatch a separate action to handle the update operation
              return updateEmployeeNameSuccess({ updatedEmployee });
            } else {
              return updateEmployeeNameFailure({ error: 'Employee not found' });
            }
          })
        );
      })
    )
  }
  );
}
