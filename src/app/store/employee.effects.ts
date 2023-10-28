import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { EmployeesService } from '../employees.service';
import { getEmployees, getEmployeesFailure, getEmployeesSuccess, getShifts, getShiftsFailure, getShiftsSuccess } from './employee.actions';

@Injectable()
export class EmployeeEffects {
  constructor(private actions$: Actions, private employeesService: EmployeesService) { }

  getEmployees$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getEmployees),
      mergeMap(() => {
        return this.employeesService.getEmployees().pipe(
          map((employees) => getEmployeesSuccess({ employees })),
          catchError(() => {
            // In case of an error, set employees to an empty array
            return of(getEmployeesFailure({ error: 'An error occurred while fetching employees', employees: [] }));
          })
        )
      })
    );
  });

  getShifts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getShifts),
      mergeMap(() => {
        return this.employeesService.getShifts().pipe(
          map((shifts) => getShiftsSuccess({ shifts })),
          catchError(() => {
            // In case of an error, set shifts to an empty array
            return of(getShiftsFailure({ error: 'An error occurred while fetching employees', shifts: [] }));
          })
        )
      })
    );
  });
}
