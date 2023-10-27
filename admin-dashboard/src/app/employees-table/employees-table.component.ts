import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { EmployeesService } from '../employees.service';
import { Employee } from '../_models/employee.interface';
import { Shift } from '../_models/shift.interface';
import { MatDialog } from '@angular/material/dialog';
import { EditModalComponent } from '../edit-modal/edit-modal.component';

@Component({
  selector: 'app-employees-table',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.scss']
})
export class EmployeesTableComponent implements OnInit {
  displayedColumns: string[] = ['select', 'name', 'email', 'clockedIn', 'regularHoursPaid', 'overtimePaid', 'edit'];
  employees: Employee[] = [];
  shifts: Shift[] = [];
  clockedIn = 0;
  clockedOut = 0;
  // Property to track whether the main checkbox is checked
  isMainCheckboxChecked = false;

  // Property to store the total number of employees
  totalEmployees = 0;
  isRowHovered = false;

  constructor(private employeeService: EmployeesService, private renderer: Renderer2, private el: ElementRef, private dialog: MatDialog) { }

  ngOnInit() {
    this.employeeService.getEmployees().subscribe((employeesList: Employee[]) => {
      this.employees = employeesList;
      this.totalEmployees = this.employees.length;
    });

    this.employeeService.getShifts().subscribe((shiftsList: Shift[]) => {
      this.shifts = shiftsList;

      // Populate the 'clockedIn' property for each employee with data from the 'shifts' array
      this.employees.forEach((employee: any, index) => {
        if (this.shifts[index] && this.shifts[index].clockIn) {
          const clockedInTime = this.formatMillisecondsToTime(this.shifts[index].clockIn);
          employee.clockedIn = clockedInTime;
        } else {
          // Set a default value if 'clockIn' data is not available
          employee.clockedIn = 0; // You can change this to a default value as needed
        }
      });
    });

    // Calculate the sum of clocked-in hours
    this.calculateTotalClockedIn();

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

  // Function to update the selection status of all employees
  updateSelectionStatus() {
    this.employees.forEach((employee: any) => {
      employee.selected = this.isMainCheckboxChecked;
    });
  }

  calculateTotalClockedIn() {
    this.clockedIn = this.shifts.reduce((total, shift) => {
      if (shift.clockIn) {
        // Convert the 'clockIn' value to hours (assuming it's in milliseconds)
        const clockedInHours = shift.clockIn / (60 * 60 * 1000); // milliseconds to hours
        return total + clockedInHours;
      }
      return total;
    }, 0); // Initialize total as 0
  }

  editRow(row: Employee) {
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

}
