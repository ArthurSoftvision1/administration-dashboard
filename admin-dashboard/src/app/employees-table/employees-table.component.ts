import { Component, OnInit } from '@angular/core';
import { EmployeesService } from '../employees.service';
import { Employee } from '../_models/employee.interface';
import { Shift } from '../_models/shift.interface';
import { MatDialog } from '@angular/material/dialog';
import { EditModalComponent } from '../edit-modal/edit-modal.component';
import { forkJoin, map, of, switchMap, take } from 'rxjs';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectEmployees } from '../store/employee.selectors';

@Component({
  selector: 'app-employees-table',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.scss']
})
export class EmployeesTableComponent implements OnInit {
  displayedColumns: string[] = ['select', 'name', 'email', 'clockedIn', 'regularHoursPaid', 'overtimePaid', 'edit'];
  employees$!: Observable<Employee[]>; // Use an observable for employees
  shifts: Shift[] = [];
  clockedIn = 0;
  // Property to track whether the main checkbox is checked
  isMainCheckboxChecked = false;

  constructor(
    private employeeService: EmployeesService,
    private dialog: MatDialog,
    private store: Store) { }

  ngOnInit(): void {
    this.employees$ = this.store.select(selectEmployees);
    this.loadEmployeesAndShifts()
      .subscribe(([employeesList, shiftsList]) => {
        this.shifts = shiftsList;
      });
    this.populateClockedInTimes();
  }

  // Function to convert milliseconds to 'hh:mm h' format
  formatMillisecondsToTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes} h`;
  }

  updateSelectionStatus(): void {
    this.employees$ = this.employees$.pipe(
      map((employees) =>
        employees.map((employee) => ({
          ...employee,
          selected: this.isMainCheckboxChecked,
        }))
      )
    );
  }

  editRow(row: Employee): void {
    const dialogRef = this.dialog.open(EditModalComponent, {
      data: row, // You can pass data to the modal if needed
      width: '70%', // Set the width to 70% of the window
      height: '80%'
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle the result when the modal is closed
      console.log(`Dialog result: ${result}`);
    });
  }

  calculateTotalClockedIn(): void {
    this.clockedIn = this.shifts.reduce((total, shift) => {
      if (shift.clockIn) {
        // Convert the 'clockIn' value to hours (assuming it's in milliseconds)
        const clockedInHours = shift.clockIn / (60 * 60 * 1000); // milliseconds to hours
        return total + clockedInHours;
      }
      return total;
    }, 0); // Initialize total as 0
  }

  private loadEmployeesAndShifts(): Observable<[Employee[], Shift[]]> {
    return this.employeeService.getEmployees().pipe(
      switchMap((employeesList: Employee[]) => {
        return forkJoin([of(employeesList), this.employeeService.getShifts()]);
      })
    );
  }

  private populateClockedInTimes(): void {
    this.employees$
      .pipe(
        take(1), // Take only the first emission
        map((employees) =>
          employees.map((employee, index) => {
            if (this.shifts[index] && this.shifts[index].clockIn) {
              const clockedInTime = this.formatMillisecondsToTime(this.shifts[index].clockIn);
              return { ...employee, clockedIn: of(clockedInTime) };
            } else {
              return { ...employee, clockedIn: of(this.formatMillisecondsToTime(this.shifts[index].clockIn)) };
            }
          })
        )
      )
      .subscribe((updatedEmployees) => {
        this.employees$ = of(updatedEmployees); // Update the employees$ observable
        this.calculateTotalClockedIn(); // Calculate total clockedIn time
      });
  }
}
