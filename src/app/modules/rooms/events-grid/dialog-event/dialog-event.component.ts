import { AuthService } from 'src/app/shared/services/auth.service';
import { Component, Inject, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { DatePipe, NgClass, NgForOf, NgIf } from "@angular/common";
import { Subject, takeUntil } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/modules/receptionist/services/patient-server/patient.service';
import { UpdateReservationComponent } from '../update-reservation/update-reservation.component';
import {MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

type ReservationStatus = 'IN_PROGRESS' | 'CONFIRMED' | 'WAITING' | 'TO_DOCTOR' | 'DONE' | 'CANCELED';

@Component({
  selector: 'app-dialog-event',
  templateUrl: './dialog-event.component.html',
  styleUrls: ['./dialog-event.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatIconModule, MatCardModule, MatListModule , FormsModule, MatButtonModule, NgForOf, NgIf, DatePipe],
  providers: [DatePipe],
  animations: [
    trigger('slideToggle', [
      state('true', style({
        height: '*',
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('false', style({
        height: '0',
        opacity: 0,
        transform: 'translateY(-10px)',
        overflow: 'hidden'
      })),
      transition('true <=> false', animate('300ms ease-in-out'))
    ])
  ],
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
    private authService:AuthService,
    public dialog: MatDialog,
    private router: Router,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {
  //console.log('Received reservation data:', reservation);
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
    if (this.isUpdatingStatus) return;

    // Step 1: Confirm cancellation
    if (status === 'CANCELED') {
      const confirmed = confirm('Are you sure you want to cancel this reservation?');
      if (!confirmed) return;
    }

    // Step 2: Get reason BEFORE calling API
    let reason: string | null = null;
    if (status === 'CANCELED') {
      reason = prompt('Please provide a cancellation reason:');
      if (!reason) return; // user dismissed the prompt — abort
    }

    this.isUpdatingStatus = true;
    this.cdr.detectChanges();

    // Step 3: Call API with reason included
    this.roomsService.changeReservationStatus(id, status, reason ?? undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.reservation.status = status;
          if (reason) {
            this.reservation.note = reason;
          }
          this.isUpdatingStatus = false;
          this.cdr.detectChanges();
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
  //console.log('Opening update dialog for room:', this.reservation.roomName);
    this.close();

    const updateDialogRef = this.dialog.open(UpdateReservationComponent, {
      data: this.reservation,
       width: '820px',
  maxHeight: '90vh',  
  panelClass: 'reservation-dialog-panel'
     });

    updateDialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        // The parent component will handle the refresh
        this.dialogRef.close('updated');
      }
    });
  }

  checkOut(reservation: any): void {
    const basePath = this.isAdmin ? 'admin' : 'receptionist';

    this.router.navigate(
      [`/${basePath}/rooms/check-out/${reservation.reservationId}`],
      {
        queryParams: {
          patientName: reservation.patientName,
          patientPhone: reservation.patientPhone
        }
      }
    )
      
    .then(() => {
       this.close()});
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
  get isAdmin(): boolean {
    return this.authService.userType === 'ROLE_ADMIN';
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

// Status helper methods
getStatusIcon(): string {
  const statusIcons: Record<ReservationStatus, string> = {
    'IN_PROGRESS': 'hourglass_empty',
    'CONFIRMED': 'check_circle',
    'WAITING': 'schedule',
    'TO_DOCTOR': 'local_hospital',
    'DONE': 'task_alt',
    'CANCELED': 'cancel'
  };
  return statusIcons[this.reservation.status as ReservationStatus] || 'help';
}

getStatusIconClass(): string {
  return `status-icon-${this.reservation.status?.toLowerCase().replace('_', '-') || 'unknown'}`;
}

getStatusChipClass(): string {
  const chipClasses: Record<ReservationStatus, string> = {
    'IN_PROGRESS': 'status-in-progress',
    'CONFIRMED': 'status-confirmed',
    'WAITING': 'status-waiting',
    'TO_DOCTOR': 'status-to-doctor',
    'DONE': 'status-done',
    'CANCELED': 'status-canceled'
  };
  return chipClasses[this.reservation.status as ReservationStatus] || '';
}

getStatusText(): string {
  const statusTexts: Record<ReservationStatus, string> = {
    'IN_PROGRESS': 'In Progress',
    'CONFIRMED': 'Confirmed',
    'WAITING': 'Waiting',
    'TO_DOCTOR': 'With Doctor',
    'DONE': 'Completed',
    'CANCELED': 'Cancelled'
  };
  return statusTexts[this.reservation.status as ReservationStatus] || this.reservation.status;
}

isWaitingOrInProgress(): boolean {
  return this.reservation.status === 'IN_PROGRESS' || this.reservation.status === 'WAITING';
}
  goToPatientInfo(phone: string): void {
    const basePath = this.isAdmin ? 'admin' : 'receptionist';
    this.router.navigate([`/${basePath}/reservation`, phone]);
    this.close();
  }
}