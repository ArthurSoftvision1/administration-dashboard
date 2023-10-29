import { createReducer, on } from '@ngrx/store';
import { Employee } from '../_models/employee.interface';
import { Shift } from '../_models/shift.interface';
import { getEmployeesSuccess, getShiftsSuccess, updateEmployeeName, updateEmployeeNameFailure, updateEmployeeNameSuccess } from './employee.actions';

// Define the initial state for the employee feature
export interface EmployeeState {
  employees: Employee[];
  shifts: Shift[],
  error: string;
}

// Define an initial state
const initialState: EmployeeState = {
  employees: [],
  shifts: [],
  error: ''
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
  })),
  on(updateEmployeeName, (state, action) => {
    const updatedEmployees = state.employees.map((employee) => {
      if (employee.id === action.id) {
        // Update the name for the matched employee
        return { ...employee, name: action.name };
      }
      return employee;
    });
    return { ...state, employees: updatedEmployees };
  }),

  on(updateEmployeeNameSuccess, (state, { updatedEmployee }) => {
    // Find and update the employee in the employees array
    const updatedEmployees = state.employees.map((employee) =>
      employee.id === updatedEmployee.id ? updatedEmployee : employee
    );

    return { ...state, employees: updatedEmployees };
  }),

  on(updateEmployeeNameFailure, (state, { error }): EmployeeState => {
    return { ...state, error };
  }))

// Create a union type of all possible actions
type EmployeeActions = ReturnType<typeof getEmployeesSuccess>
  | ReturnType<typeof getShiftsSuccess>
  | ReturnType<typeof updateEmployeeNameSuccess>
  | ReturnType<typeof updateEmployeeNameFailure>;

export function reducer(state: EmployeeState | undefined, action: EmployeeActions) {
  return employeeReducer(state, action);
}
