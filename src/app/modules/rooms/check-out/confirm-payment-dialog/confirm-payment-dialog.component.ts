import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface PaymentSummaryLine {
  label: string;
  value: string;
}

export interface ConfirmPaymentDialogData {
  serviceName: string;
  method: 'normal' | 'points' | 'remainPoints' | 'package';
  lines: PaymentSummaryLine[];          // breakdown rows shown in dialog
  pointsBefore?: number;
  pointsUsed?: number;
  pointsAfter?: number;
  remainingCashNeeded?: number;         // EGP cash still owed after partial points
}

@Component({
  selector: 'app-confirm-payment-dialog',
  templateUrl: './confirm-payment-dialog.component.html',
})
export class ConfirmPaymentDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmPaymentDialogData
  ) { }

  confirm() { this.dialogRef.close(true); }
  cancel() { this.dialogRef.close(false); }
}