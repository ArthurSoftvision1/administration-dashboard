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
  clockedIn = 0;
  // Property to track whether the main checkbox is checked
  isMainCheckboxChecked = false;
  hourlyRate: number = 10; // Replace with your hourlyRate

  constructor(
    private dialog: MatDialog,
    private store: Store) { }

  ngOnInit(): void {
    this.employees$ = this.store.select(selectEmployees);
    this.shifts$ = this.store.select(selectShifts);
    this.populateClockedInTimes();
  }

  // we rounded this the value in order to calculate easier
  formatMillisecondsToTime(milliseconds: number, roundHours: boolean = true): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);

    if (roundHours) {
      return Math.round(hours).toString();
    } else {
      return hours.toString();
    }
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
    combineLatest([this.employees$, this.shifts$])
      .pipe(
        take(1),
        map(([employees, shifts]) =>
          employees.map((employee: Employee, index: number) => {
            if (shifts[index] && shifts[index].clockIn) {
              const clockedInTime = this.formatMillisecondsToTime(shifts[index].clockIn);
              const hourlyRate = employee.hourlyRate;

              // Extract and round the integer part of clockedInTime
              const roundedClockedIn = Math.round(parseInt(clockedInTime, 10));

              const regularHoursPaid = this.calculateRegularHoursPaid(hourlyRate, roundedClockedIn);

              return { ...employee, clockedIn: of(clockedInTime), regularHoursPaid: Math.round(regularHoursPaid) };
            } else {
              return { ...employee, clockedIn: of(this.formatMillisecondsToTime(shifts[index].clockIn)) };
            }
          })
        )
      )
      .subscribe((updatedEmployees: Employee[]) => {
        this.employees$ = of(updatedEmployees);
      });
  }

  calculateRegularHoursPaid(hourlyRate: number, clockedInTime: number): number {
    return hourlyRate * clockedInTime;
  }
}
