import { createReducer, on } from '@ngrx/store';
import { Employee } from '../_models/employee.interface';
import { getEmployees, getEmployeesSuccess } from './employee.actions';

// Define the initial state for the employee feature
export interface EmployeeState {
  employees: Employee[];
}

// Define an initial state
const initialState: EmployeeState = {
  employees: [],
  // Initialize other state properties here
};

// Create the reducer function
export const employeeReducer = createReducer(
  initialState,
  on(getEmployeesSuccess, (state, { employees }): EmployeeState => ({
    ...state,
    employees,
  }))
);

// Create a union type of all possible actions
type EmployeeActions = ReturnType<typeof getEmployeesSuccess> | ReturnType<typeof getEmployees>;

export function reducer(state: EmployeeState | undefined, action: EmployeeActions) {
  return employeeReducer(state, action);
}
