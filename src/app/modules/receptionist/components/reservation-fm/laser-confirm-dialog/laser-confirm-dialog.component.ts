import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface LaserConfirmDialogData {
  warning: string;
  message: string;
}

@Component({
    selector: 'app-laser-confirm-dialog',
    template: `
    <div class="confirm-dialog">
      <div class="confirm-dialog__header">
        <mat-icon class="warn-icon">warning_amber</mat-icon>
        <h2 mat-dialog-title>Confirm Reservation</h2>
      </div>

      <mat-dialog-content>
        <p class="confirm-dialog__message">{{ data.message }}</p>
        <div class="confirm-dialog__warning-card">
          <mat-icon>info_outline</mat-icon>
          <span>{{ data.warning }}</span>
        </div>
        <p class="confirm-dialog__question">
          Do you want to proceed anyway?
        </p>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-stroked-button (click)="onCancel()">
          <mat-icon>cancel</mat-icon> No, Cancel
        </button>
        <button mat-raised-button color="warn" (click)="onConfirm()">
          <mat-icon>check_circle</mat-icon> Yes, Proceed
        </button>
      </mat-dialog-actions>
    </div>
  `,
    styles: [`
    .confirm-dialog { padding: 8px; min-width: 420px; max-width: 520px; }

    .confirm-dialog__header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 4px;
    }

    .warn-icon { color: #f59e0b; font-size: 28px; width: 28px; height: 28px; }

    h2[mat-dialog-title] { margin: 0; font-size: 1.2rem; }

    .confirm-dialog__message {
      color: #374151;
      margin-bottom: 14px;
    }

    .confirm-dialog__warning-card {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      background: #fffbeb;
      border: 1px solid #f59e0b;
      border-radius: 8px;
      padding: 12px 14px;
      color: #92400e;
      margin-bottom: 14px;
      font-size: 0.9rem;
    }

    .confirm-dialog__warning-card mat-icon { color: #f59e0b; flex-shrink: 0; margin-top: 2px; }

    .confirm-dialog__question { color: #6b7280; font-size: 0.9rem; }
  `],
    standalone: true,
    imports: [MatIconModule, MatDialogModule, MatButtonModule]
})
export class LaserConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: LaserConfirmDialogData,
    private dialogRef: MatDialogRef<LaserConfirmDialogComponent>
  ) { }

  onConfirm(): void { this.dialogRef.close(true); }
  onCancel(): void { this.dialogRef.close(false); }
}