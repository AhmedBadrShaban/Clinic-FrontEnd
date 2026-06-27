import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ReportsService } from 'src/app/modules/admin/services/reports/reports.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
 
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Stats
  newPatients: number = 0;
  income: number = 0;
  outCome: number = 0;
  pulses: number = 0;
  reservationsNumber: number = 0;
  isLoading: boolean = false;

  // Filter state
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  filterClinic: string = '';
  activeClinic: string = '';
  allClinics: string[] = [];
  filteredClinics: string[] = [];
  hasClinicFilter: boolean = false;

  months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  years: number[] = [];

  get selectedMonthLabel(): string {
    return this.months.find(m => m.value === this.selectedMonth)?.label ?? '';
  }

  constructor(
    private reportService: ReportsService,
    private cdr: ChangeDetectorRef
  ) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 4; y <= currentYear + 1; y++) {
      this.years.push(y);
    }
  }

  ngOnInit(): void {
    this.loadClinics();
    this.loadReports();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMonthChange(month: number): void {
    this.selectedMonth = month;
    this.loadReports();
  }

  onYearChange(year: number): void {
    this.selectedYear = year;
    this.loadReports();
  }

  private loadReports(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.reportService.getMonthlyReports(
      this.selectedMonth,
      this.selectedYear,
      this.activeClinic || undefined
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.newPatients = data.newPatients || 0;
          this.income = data.income || 0;
          this.outCome = data.outcome || 0;
          this.pulses = data.pulses || 0;
          this.reservationsNumber = data.reservations || 0;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading reports:', err);
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
        error: (err) => console.error('Failed to load clinics:', err)
      });
  }

  onClinicSearch(value: string): void {
    this.filterClinic = value;
    const search = value.toLowerCase().trim();
    this.filteredClinics = this.allClinics.filter(c => c.toLowerCase().includes(search));
  }

  onClinicSelected(clinic: string): void {
    this.filterClinic = clinic;
    this.activeClinic = clinic;
    this.hasClinicFilter = true;
    this.loadReports();
  }

  clearClinicFilter(): void {
    this.filterClinic = '';
    this.activeClinic = '';
    this.hasClinicFilter = false;
    this.filteredClinics = [...this.allClinics];
    this.loadReports();
  }

  formatNumber(value: number): string {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(1) + 'K';
    return value.toLocaleString();
  }

  formatFull(value: number): string {
    return value.toLocaleString();
  }
}