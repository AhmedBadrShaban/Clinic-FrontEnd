import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgClass, NgSwitch, NgSwitchCase, NgIf, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface ServicePaymentSummary {
  serviceName: string;
  pulses: number;
  price: number;
  totalCost: number;
  // payment type resolved from paymentsMethods
  paymentType: 'normal' | 'points' | 'mixed' | 'package';
  // cash breakdown (null if not used)
  cash?: number;
  visa?: number;
  vodafoneCash?: number;
  credit?: number;
  debit?: number;
  instaPay?: number;
  cashTotal?: number;
  // points used for this service
  pointsUsed?: number;
  // package sessions remaining after payment
  packageSessionsLeft?: number;
}

export interface FinalCheckoutSummaryData {
  patientName: string;
  patientPhone: string;
  services: ServicePaymentSummary[];
  grandTotal: number;
  pointsBefore: number;
  pointsAfter: number;
}

@Component({
    selector: 'app-final-checkout-summary-dialog',
    templateUrl: './final-checkout-summary-dialog.component.html',
    standalone: true,
    imports: [
        MatDialogModule,
        MatIconModule,
        NgFor,
        NgClass,
        NgSwitch,
        NgSwitchCase,
        NgIf,
        MatButtonModule,
        DecimalPipe,
    ],
})
export class FinalCheckoutSummaryDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FinalCheckoutSummaryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FinalCheckoutSummaryData
  ) { }

  confirm() { this.dialogRef.close(true); }
  cancel() { this.dialogRef.close(false); }

  hasCashBreakdown(s: ServicePaymentSummary): boolean {
    return !!(s.cash || s.visa || s.vodafoneCash || s.credit || s.debit || s.instaPay);
  }
}