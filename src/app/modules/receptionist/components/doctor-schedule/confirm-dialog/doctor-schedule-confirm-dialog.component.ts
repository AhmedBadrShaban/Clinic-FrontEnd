import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DoctorScheduleConfirmData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /* color scheme: 'primary' | 'warn' */
  variant?: 'primary' | 'warn';
}

@Component({
  selector: 'app-doctor-schedule-confirm-dialog',
  templateUrl: './doctor-schedule-confirm-dialog.component.html',
  styleUrls: ['./doctor-schedule-confirm-dialog.component.css']
})
export class DoctorScheduleConfirmDialogComponent {
  constructor(
    public ref: MatDialogRef<DoctorScheduleConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DoctorScheduleConfirmData
  ) { }

  get confirmLabel(): string {
    return this.data.confirmLabel || 'Confirm';
  }

  get cancelLabel(): string {
    return this.data.cancelLabel || 'Cancel';
  }
}
