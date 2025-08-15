import { Component, Inject, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { DatePipe, NgClass, NgForOf, NgIf } from "@angular/common";
import { Subject, takeUntil } from 'rxjs';

import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/modules/receptionist/services/patient-server/patient.service';
import { UpdateReservationComponent } from '../update-reservation/update-reservation.component';

@Component({
  selector: 'app-dialog-event',
  templateUrl: './dialog-event.component.html',
  styleUrls: ['./dialog-event.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, NgClass, NgForOf, NgIf, DatePipe],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogEventComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  toggle = false;
  debit = false;
  isUpdatingStatus = false;

  constructor(
    public dialogRef: MatDialogRef<DialogEventComponent>,
    @Inject(MAT_DIALOG_DATA) public reservation: any = {},
    private roomsService: RoomsService,
    private patienDepit: PatientService,
    public dialog: MatDialog,
    private router: Router,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {
    console.log('Received reservation data:', reservation);
  }

  ngOnInit(): void {
    // Check patient debit status
    this.patienDepit.checkDepit(this.reservation.patientPhone)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.debit = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error checking patient debit:', err);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  chengeReservationStatus(id: number, status: string): void {
    if (this.isUpdatingStatus) return; // Prevent multiple simultaneous updates

    this.isUpdatingStatus = true;
    this.cdr.detectChanges();

    this.roomsService.changeReservationStatus(id, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          console.log('Status updated:', response.message);

          // Update local reservation status
          this.reservation.status = status;

          // If canceling, prompt for reason
          if (status === 'CANCELED') {
            const reason = prompt('Please provide a cancellation reason:');
            if (reason) {
              this.reservation.note = reason;
            }
          }

          this.isUpdatingStatus = false;
          this.cdr.detectChanges();

          // Close dialog and indicate update
          this.dialogRef.close('updated');
        },
        error: (err) => {
          console.error('Error updating status:', err);
          alert(err.error?.message || 'Failed to update reservation status');
          this.isUpdatingStatus = false;
          this.cdr.detectChanges();
        }
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  changeToogle(): void {
    this.toggle = !this.toggle;
  }

  close(): void {
    this.dialogRef.close();
  }

  openDialog(): void {
    console.log('Opening update dialog for room:', this.reservation.roomName);
    this.close();

    const updateDialogRef = this.dialog.open(UpdateReservationComponent, {
      data: this.reservation,
      width: '600px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });

    updateDialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        // The parent component will handle the refresh
        this.dialogRef.close('updated');
      }
    });
  }

  checkOut(id: number): void {
    console.log('Checking out reservation:', id);
    this.router.navigateByUrl(`receptionist/rooms/check-out/${id}`);
    this.close();
  }

  formatTimeTo12Hour(time: string): string {
    if (!time) {
      return '';
    }
    const timeAsDate = new Date(`1970-01-01T${time}`);
    return this.datePipe.transform(timeAsDate, 'h:mm a') || '';
  }

  // Helper methods for button states
  canConfirm(): boolean {
    return ['IN_PROGRESS', 'WAITING'].includes(this.reservation.status) && !this.isUpdatingStatus;
  }

  canSendToDoctor(): boolean {
    return this.reservation.status === 'CONFIRMED' && !this.isUpdatingStatus;
  }

  canCheckout(): boolean {
    return this.reservation.status === 'DONE' && !this.isUpdatingStatus;
  }

  canCancel(): boolean {
    return this.reservation.status !== 'DONE' &&
      this.reservation.status !== 'COMPLETED' &&
      this.reservation.status !== 'CANCELED' &&
      !this.isUpdatingStatus;
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'IN_PROGRESS': 'inprogress',
      'CONFIRMED': 'confirmed',
      'WAITING': 'waiting',
      'TO_DOCTOR': 'to-doctor',
      'DONE': 'done',
      'CANCELED': 'cancelled',
      'CANCELLED': 'cancelled',
      'COMPLETED': 'completed'
    };
    return statusClasses[status] || '';
  }
}