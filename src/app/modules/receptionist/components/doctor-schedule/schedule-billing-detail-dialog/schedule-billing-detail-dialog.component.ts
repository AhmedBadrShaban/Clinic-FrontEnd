import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ScheduleBillingService } from '../../../services/schedule-billing/schedule-billing.service';
import { ScheduleBillingDetail, ScheduleBillingServiceLine } from '../../../models/schedule-billing.model';

@Component({
  selector: 'app-schedule-billing-detail-dialog',
  templateUrl: './schedule-billing-detail-dialog.component.html',
  styleUrls: ['./schedule-billing-detail-dialog.component.css']
})
export class ScheduleBillingDetailDialogComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  billingId: number;
  detail: ScheduleBillingDetail | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private billingService: ScheduleBillingService,
    public dialogRef: MatDialogRef<ScheduleBillingDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { billingId: number }
  ) {
    this.billingId = data.billingId;
  }

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.billingService.getBillingDetail(this.billingId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (detail) => {
          this.detail = detail;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          if (err?.status === 404) {
            this.error = 'Billing record not found. It may have been deleted.';
          } else {
            this.error = err?.error?.message || 'Failed to load billing details.';
          }
        }
      });
  }

  totalForLine(line: ScheduleBillingServiceLine): number {
    return line.linePaymentAmount;
  }

  doctorRateLabel(line: ScheduleBillingServiceLine): string {
    if (line.fixedFeeApplied != null) {
      return `Fixed: ${line.fixedFeeApplied}`;
    }
    if (line.doctorPercentageApplied != null) {
      const pct = Math.round(line.doctorPercentageApplied * 100);
      return `${pct}% of (cost - material)`;
    }
    return '—';
  }

  isPaid(detail: ScheduleBillingDetail): boolean {
    return detail.paymentStatus === 'PAID';
  }

  close(): void {
    this.dialogRef.close();
  }
}
