import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-delete-task',
  templateUrl: './dialog-delete-task.component.html',
  styleUrls: ['./dialog-delete-task.component.scss']
})
export class DialogDeleteTaskComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

}
