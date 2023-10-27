import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as dbData from '@insightfulio/insightful-test-api-server/db.json';
import { catchError, map, Observable, of } from 'rxjs';
import { Employee } from './_models/employee.interface';
import { EmployeeData } from './_models/employees.interface';
import { Shift } from './_models/shift.interface';
import { ShiftData } from './_models/shifts.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private data: any; // Store the JSON data here

  constructor(private http: HttpClient) {
    this.data = dbData;
    console.log(this.data, 'DATA')
  }

  getEmployees(): Observable<Employee[]> {
    // If data is already loaded, return it
    if (this.data) {
      return of(this.data.employees);
    } else {
      // Fetch and store the data, then return employees
      return this.http.get<EmployeeData>('@insightfulio/insightful-test-api-server/db.json').pipe(
        map(data => {
          this.data = data;
          return data.employees;
        }),
        catchError(error => {
          console.error('Error fetching data:', error);
          return of([]);
        })
      );
    }
  }

  getShifts(): Observable<Shift[]> {
    // If data is already loaded, return it
    if (this.data) {
      return of(this.data.shifts);
    } else {
      // Fetch and store the data, then return shifts
      return this.http.get<ShiftData>('@insightfulio/insightful-test-api-server/db.json').pipe(
        map(data => {
          this.data = data;
          return data.shifts;
        }),
        catchError(error => {
          console.error('Error fetching data:', error);
          return of([]);
        })
      );
    }
  }
}
