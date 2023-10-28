import { createReducer, on } from '@ngrx/store';
import { Employee } from '../_models/employee.interface';
import { Shift } from '../_models/shift.interface';
import { getEmployees, getEmployeesSuccess, getShiftsSuccess } from './employee.actions';

// Define the initial state for the employee feature
export interface EmployeeState {
  employees: Employee[];
  shifts: Shift[]
}

// Define an initial state
const initialState: EmployeeState = {
  employees: [],
  shifts: []
  // Initialize other state properties here
};

// Create the reducer function
export const employeeReducer = createReducer(
  initialState,
  on(getEmployeesSuccess, (state, { employees }): EmployeeState => ({
    ...state,
    employees,
  })),
  on(getShiftsSuccess, (state, { shifts }): EmployeeState => ({
    ...state,
    shifts,
  }))
);

// Create a union type of all possible actions
type EmployeeActions = ReturnType<typeof getEmployeesSuccess> | ReturnType<typeof getEmployees> | ReturnType<typeof getShiftsSuccess>;

export function reducer(state: EmployeeState | undefined, action: EmployeeActions) {
  return employeeReducer(state, action);
}
