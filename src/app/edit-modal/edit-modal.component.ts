import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Employee } from '../_models/employee.interface';


@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent {
  employee: Employee;
  editMode = false;
  editedName = ''; // Initialize editedName with employee.name

  constructor(@Inject(MAT_DIALOG_DATA) public data: Employee, private dialogRef: MatDialogRef<EditModalComponent>) {
    this.employee = data;
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.editedName = this.employee.name; // Capture the initial value
    }
  }

  saveChanges() {
    this.editMode = false;
    this.employee.name = this.editedName; // Update the employee name
    // You can save the changes to your data source here.
  }

  cancelEdit() {
    this.editMode = false;
    // Reset the input field if the user cancels.
    this.editedName = this.employee.name; // Restore the original name
  }

  closeModal() {
    this.dialogRef.close();
  }

 
}
