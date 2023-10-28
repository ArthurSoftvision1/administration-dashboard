import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromEmployee from './employee.reducer';

export const selectEmployeeState = createFeatureSelector<fromEmployee.EmployeeState>('employees');

export const selectEmployees = createSelector(
  selectEmployeeState,
  (state: fromEmployee.EmployeeState) => state.employees
);