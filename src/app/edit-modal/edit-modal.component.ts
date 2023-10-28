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

  constructor(@Inject(MAT_DIALOG_DATA) public data: Employee, private dialogRef: MatDialogRef<EditModalComponent>) {
    this.employee = data;
  }

  saveChanges() {
    return;
  }

  closeModal() {
    this.dialogRef.close();
  }
}
