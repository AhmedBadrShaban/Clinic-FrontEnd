// reports.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { ReportsService } from 'src/app/modules/admin/services/Reports/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data properties
  newPatients: number = 0;
  Income: number = 0;
  outCome: number = 0;
  pulses: number = 0;
  reservationsNumber: number = 0;
  isLoading: boolean = false;

  // Date picker control
  monthYearControl = new FormControl(new Date());

  constructor(
    private reportService: ReportsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load initial data with current month/year
    this.loadReports();
    
    // Subscribe to date changes
    this.monthYearControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(date => {
        if (date) {
          console.log('Date changed:', date);
          this.loadReports();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadReports(): void {
    const selectedDate = this.monthYearControl.value;
    if (!selectedDate) return;

    const month = selectedDate.getMonth() + 1; // getMonth() returns 0-11
    const year = selectedDate.getFullYear();

    console.log('Loading reports for:', { month, year });
    
    this.isLoading = true;
    this.cdr.detectChanges();

    this.reportService.getMonthlyReports(month, year)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('Reports data received:', data);
          this.newPatients = data.newPatients || 0;
          this.Income = data.income || 0;
          this.outCome = data.outcome || 0;
          this.pulses = data.pulses || 0;
          this.reservationsNumber = data.reservations || 0;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading reports:', error);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  // Handle month selection from datepicker
  monthSelected(normalizedMonth: Date, datepicker: any): void {
    const ctrlValue = this.monthYearControl.value || new Date();
    ctrlValue.setMonth(normalizedMonth.getMonth());
    ctrlValue.setFullYear(normalizedMonth.getFullYear());
    this.monthYearControl.setValue(ctrlValue);
    datepicker.close();
  }

  // Method to format the display of selected month/year
  getSelectedMonthYear(): string {
    const date = this.monthYearControl.value;
    if (!date) return '';
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long' 
    };
    return date.toLocaleDateString('en-US', options);
  }
}