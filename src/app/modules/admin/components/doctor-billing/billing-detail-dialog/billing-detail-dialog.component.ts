import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BillingListRecord } from '../../../models/doctor-billing';

@Component({
  selector: 'app-billing-detail-dialog',
  templateUrl: './billing-detail-dialog.component.html',
  styleUrls: ['./billing-detail-dialog.component.css']
})
export class BillingDetailDialogComponent {
  constructor(
    public ref: MatDialogRef<BillingDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public record: BillingListRecord
  ) {}
}
