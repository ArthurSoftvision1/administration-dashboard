import { createAction, props } from '@ngrx/store';
import { Employee } from '../_models/employee.interface';

export const getEmployees = createAction('[Employees] Get Employees');
export const getEmployeesSuccess = createAction(
  '[Employees] Get Employees Success',
  props<{ employees: Employee[] }>()
);
export const getEmployeesFailure = createAction('[Employee] Get Employees Failure', props<{ error: string, employees: Employee[] }>());

