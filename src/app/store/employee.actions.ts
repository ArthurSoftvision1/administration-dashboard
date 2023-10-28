import { createAction, props } from '@ngrx/store';
import { Employee } from '../_models/employee.interface';
import { Shift } from '../_models/shift.interface';

export const getEmployees = createAction('[Employees] Get Employees');
export const getEmployeesSuccess = createAction(
  '[Employees] Get Employees Success',
  props<{ employees: Employee[] }>()
);
export const getEmployeesFailure = createAction('[Employee] Get Employees Failure', props<{ error: string, employees: Employee[] }>());

export const getShifts = createAction('[Shifts] Get Shifts');
export const getShiftsSuccess = createAction(
  '[Shifts] Get Shifts Success',
  props<{ shifts: Shift[] }>()
);
export const getShiftsFailure = createAction('[Shift] Get Shifts Failure', props<{ error: string, shifts: Shift[] }>());

export const getEmployeesData = createAction('[EmplyeesData] Get EmployeesData');


