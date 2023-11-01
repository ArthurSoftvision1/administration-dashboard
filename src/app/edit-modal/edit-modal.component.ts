import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { updateEmployeeName } from '../store/employee.actions';
import { Employee } from '../_models/employee.interface';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditModalComponent {
  employee: Employee;
  editMode = false;
  editedName = ''; // Initialize editedName with employee.name
  editedHourlyRate = 0;
  overtimeHourlyRate = 0;
  editModeHourlyRate = false;
  editModeOvertimeHourlyRate = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Employee,
    private dialogRef: MatDialogRef<EditModalComponent>,
    private store: Store,
    private cd: ChangeDetectorRef) {
    this.employee = data;
  }

  // Method to toggle edit mode for a specific employee
  toggleEditMode(inputType: string) {
    if (inputType === 'nameInput') {
      this.editMode = !this.editMode;
      if (this.editMode) {
        this.editedName = this.employee.name; // Capture the initial value
      }
    }

    if (inputType === 'hourlyRateInput') {
      this.editModeHourlyRate = !this.editModeHourlyRate;
      if (this.editModeHourlyRate) {
        this.editedHourlyRate = this.employee.hourlyRate; // Capture the initial value
      }
    }

    if (inputType === 'overTimeHourRateInput') {
      this.editModeOvertimeHourlyRate = !this.editModeOvertimeHourlyRate;
      if (this.editModeOvertimeHourlyRate) {
        this.overtimeHourlyRate = this.employee.hourlyRateOvertime; // Capture the initial value
      }
    }
    this.cd.detectChanges();
  }

  closeModal() {
    this.editMode = false;
    this.dialogRef.close();
  }

  saveModalChanges() {
    this.editMode = false;
    this.employee.name = this.editedName;
    // After you update your properties, trigger change detection
    this.cd.detectChanges();
    if (this.editedName) {
      // Dispatch the action to update the employee name in the state
      this.store.dispatch(updateEmployeeName({ id: this.employee.id, name: this.editedName }));
    }
    this.dialogRef.close();
  }
}
