// doctor-schedule.component.ts
import { DatePipe } from '@angular/common';
import { DoctorScheduleServiceService } from '../../services/doctor-schedule-service/doctor-schedule-service.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize } from 'ng-zorro-antd/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopUpFormComponent } from './pop-up-form/pop-up-form.component';
import { scheduleData } from '../../models/doctor.schedule.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

type TableScroll = 'unset' | 'scroll' | 'fixed';

interface Setting {
  bordered: boolean;
  loading: boolean;
  pagination: boolean;
  sizeChanger: boolean;
  title: boolean;
  header: boolean;
  footer: boolean;
  expandable: boolean;
  checkbox: boolean;
  fixHeader: boolean;
  noResult: boolean;
  ellipsis: boolean;
  simple: boolean;
  size: NzTableSize;
  tableScroll: TableScroll;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;
}

@Component({
  selector: 'app-doctor-schedule',
  templateUrl: './doctor-schedule.component.html',
  styleUrls: ['./doctor-schedule.component.css']
})
export class DoctorScheduleComponent implements OnInit, OnDestroy {

  // ── State ─────────────────────────────────────────────────
  selectedDate: Date = new Date();
  listOfData: scheduleData[] = [];
  searchValue = '';
  isAdmin = false;
  isLoading = false;

  // Tracks whether the current view is a search result (so we know not to re-apply date filter)
  isSearchMode = false;

  fixedColumn = false;
  scrollX: string | null = null;
  scrollY: string | null = null;
  settingValue: Setting;

  private destroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private doctorScheduleService: DoctorScheduleServiceService,
    private loggedIn: AuthService
  ) {
    this.settingValue = {
      bordered: true,
      loading: false,
      pagination: true,
      sizeChanger: true,
      title: false,
      header: true,
      footer: false,
      expandable: false,
      checkbox: false,
      fixHeader: false,
      noResult: false,
      ellipsis: false,
      simple: false,
      size: 'small' as NzTableSize,
      paginationType: 'default' as NzTablePaginationType,
      tableScroll: 'unset' as TableScroll,
      tableLayout: 'auto' as NzTableLayout,
      position: 'both' as NzTablePaginationPosition
    };
  }

  ngOnInit(): void {
    this.isAdmin = this.loggedIn.userType === 'ROLE_ADMIN';

    // Load today's schedules on init.
    // Refreshes after create/edit are driven by dialogRef.afterClosed() in openDialog()
    // — no BehaviorSubject subscription needed, no nested HTTP calls.
    this.loadByDate(this.selectedDate);
  }

  ngOnDestroy(): void {
    // FIX: Properly unsubscribe to prevent memory leak
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Data Loading ──────────────────────────────────────────

  private loadByDate(date: Date): void {
    const formatted = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (!formatted) return;

    this.isLoading = true;
    this.doctorScheduleService.filterByDate(formatted)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: scheduleData[]) => {
          this.listOfData = [...data].sort((a, b) => a.startTime.localeCompare(b.startTime));
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.showError('Failed to load schedules.');
        }
      });
  }

  private executeSearch(key: string): void {
    this.isLoading = true;
    this.doctorScheduleService.Search(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: scheduleData[]) => {
          this.listOfData = data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.showError('Search failed.');
        }
      });
  }

  // ── User Actions ──────────────────────────────────────────

  onDateChange(event: any): void {
    this.selectedDate = event.value;
    this.isSearchMode = false;
    this.searchValue = '';  // FIX: clear search visually when date is picked
    this.loadByDate(this.selectedDate);
  }

  onDateInput(value: string): void {
    if (!value) return;
    const d = new Date(`${value}T00:00:00`);
    this.onDateChange({ value: d });
  }

  search(key: string): void {
    if (!key?.trim()) {
      // If search is cleared, go back to date filter
      this.isSearchMode = false;
      this.loadByDate(this.selectedDate);
      return;
    }
    this.isSearchMode = true;
    // FIX: selectedDate is NOT silently nulled — it's preserved so switching back works
    this.executeSearch(key);
  }

  openDialog(data: any): void {
    // Pre-fill date from the active filter when creating a new schedule
    if (data.new && this.selectedDate) {
      data.date = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd') ?? undefined;
    }

    const dialogRef = this.dialog.open(PopUpFormComponent, { data });

    // When popup closes with result=true (success), refresh immediately —
    // no race condition since the dialog is fully closed before this fires
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result === true) {
          this.refreshAfterChange();
        }
      });
  }

  changeConfirmStatus(scheduleId: number): void {
    this.doctorScheduleService.changeScheduleStatus(scheduleId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.showSuccess(res.message);
          this.refreshAfterChange();
        },
        error: (err) => this.showError(err.error?.message || 'Failed to update status.')
      });
  }

  deleteSchedule(id: number): void {
    // FIX: Material confirm dialog instead of browser confirm()
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);
    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      this.doctorScheduleService.deleteSchedule(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.showSuccess(res.message || 'Schedule deleted.');
            this.refreshAfterChange();
          },
          error: (err) => this.showError(err.error?.message || 'Delete failed.')
        });
    });
  }

  // ── Helpers ───────────────────────────────────────────────

  /**
   * After any mutation (confirm/delete), re-apply whichever filter is currently active.
   * FIX: replaces the scattered getAllSchedules() calls that ignored active filters.
   */
  private refreshAfterChange(): void {
    if (this.isSearchMode && this.searchValue.trim()) {
      this.executeSearch(this.searchValue);
    } else {
      this.loadByDate(this.selectedDate);
    }
  }

  formatTimeTo12Hour(time: string): string {
    if (!time) return '';
    const timeAsDate = new Date(`1970-01-01T${time}`);
    return this.datePipe.transform(timeAsDate, 'h:mm a') || '';
  }

  clearSearch(): void {
    this.searchValue = '';
    this.isSearchMode = false;
    this.loadByDate(this.selectedDate);
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}

// ── Inline confirm dialog component ──────────────────────────
// Kept inline to avoid creating a separate file for a tiny dialog
import { Component as Comp } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Comp({
  selector: 'app-confirm-delete-dialog',
  template: `
    <div class="confirm-dialog">
      <div class="confirm-icon">
        <mat-icon>warning_amber</mat-icon>
      </div>
      <h3>Delete Schedule?</h3>
      <p>This action cannot be undone.</p>
      <div class="confirm-actions">
        <button mat-stroked-button (click)="dialogRef.close(false)">Cancel</button>
        <button mat-raised-button color="warn" (click)="dialogRef.close(true)">Delete</button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      padding: 24px;
      text-align: center;
      min-width: 280px;
    }
    .confirm-icon mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #f57c00;
    }
    h3 { margin: 12px 0 6px; font-size: 1.1rem; font-weight: 700; color: #333; }
    p  { color: #777; margin: 0 0 20px; font-size: 0.9rem; }
    .confirm-actions { display: flex; gap: 12px; justify-content: center; }
  `]
})
export class ConfirmDeleteDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>) { }
}