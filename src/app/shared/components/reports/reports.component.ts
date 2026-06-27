// reports.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { ReportsService } from 'src/app/modules/admin/services/reports/reports.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatIconModule,
    FormsModule,
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
  filterClinic: string = '';
  activeClinic: string = '';
  allClinics: string[] = [];
  filteredClinics: string[] = [];
  hasClinicFilter: boolean = false;
  constructor(
    private reportService: ReportsService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.loadClinics();
    this.loadReports();

    this.monthYearControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(date => {
        if (date) {
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

    this.reportService.getMonthlyReports(
      month,
      year,
      this.activeClinic || undefined
    )
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
  private loadClinics(): void {
    this.reportService.getAllClinics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clinics) => {
          this.allClinics = clinics || [];
          this.filteredClinics = [...this.allClinics];
        },
        error: (error) => {
          console.error('Failed to load clinics:', error);
        }
      });
  } onClinicSearch(value: string): void {
    this.filterClinic = value;

    const search = value.toLowerCase().trim();

    this.filteredClinics = this.allClinics.filter(clinic =>
      clinic.toLowerCase().includes(search)
    );
  }
  onClinicSelected(clinic: string): void {
    this.filterClinic = clinic;
    this.activeClinic = clinic;
    this.hasClinicFilter = true;
    this.loadReports();
  }
  applyClinicFilter(): void {
    this.activeClinic = this.filterClinic.trim();
    this.hasClinicFilter = !!this.activeClinic;
    this.loadReports();
  }
  clearClinicFilter(): void {
    this.filterClinic = '';
    this.activeClinic = '';
    this.hasClinicFilter = false;
    this.filteredClinics = [...this.allClinics];
    this.loadReports();
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