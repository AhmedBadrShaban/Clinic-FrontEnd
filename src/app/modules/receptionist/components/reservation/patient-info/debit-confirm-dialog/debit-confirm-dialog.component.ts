import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-debit-confirm-dialog',
  templateUrl: './debit-confirm-dialog.component.html'
})
export class DebitConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DebitConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { amount: number }
  ) { }

}