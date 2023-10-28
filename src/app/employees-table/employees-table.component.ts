import { Component, OnInit } from '@angular/core';
import { Employee } from '../_models/employee.interface';
import { Shift } from '../_models/shift.interface';
import { MatDialog } from '@angular/material/dialog';
import { EditModalComponent } from '../edit-modal/edit-modal.component';
import { combineLatest, map, of, take } from 'rxjs';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectEmployees, selectShifts } from '../store/employee.selectors';

@Component({
  selector: 'app-employees-table',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.scss']
})
export class EmployeesTableComponent implements OnInit {
  displayedColumns: string[] = ['select', 'name', 'email', 'clockedIn', 'regularHoursPaid', 'overtimePaid', 'edit'];
  employees$!: Observable<Employee[]>; // Use an observable for employees
  shifts$!: Observable<Shift[]>; // Use an observable for shifts
  shifts: Shift[] = [];
  clockedIn = 0;
  // Property to track whether the main checkbox is checked
  isMainCheckboxChecked = false;

  constructor(
    private dialog: MatDialog,
    private store: Store) { }

  ngOnInit(): void {
    this.employees$ = this.store.select(selectEmployees);
    this.shifts$ = this.store.select(selectShifts);
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

  private populateClockedInTimes(): void {
    // Combine the latest emissions of employees$ and shifts$
    combineLatest([this.employees$, this.shifts$])
      .pipe(
        take(1), // Take only the first emission
        map(([employees, shifts]) =>
          employees.map((employee: Employee, index: number) => {
            if (shifts[index] && shifts[index].clockIn) {
              const clockedInTime = this.formatMillisecondsToTime(shifts[index].clockIn);
              return { ...employee, clockedIn: of(clockedInTime) };
            } else {
              return { ...employee, clockedIn: of(this.formatMillisecondsToTime(shifts[index].clockIn)) };
            }
          })
        )
      )
      .subscribe((updatedEmployees: Employee[]) => {
        // Update the employees$ observable
        this.employees$ = of(updatedEmployees);
      });
  }
}
