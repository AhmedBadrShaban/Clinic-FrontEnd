import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { startWith, debounceTime } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportsService, MonthlyReportResponse } from '../../services/Reports/reports.service';
import { RoomsService, Room } from 'src/app/modules/Services/rooms/rooms.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

interface MonthOption {
  value: number;
  name: string;
}

interface ReportTypeOption {
  value: string;
  name: string;
}

@Component({
    selector: 'app-income',
    templateUrl: './income.component.html',
    styleUrls: ['./income.component.css'],
    standalone: true,
    imports: [MatCardModule, MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, NgFor, MatOptionModule, NgIf, MatButtonModule, MatProgressSpinnerModule, CurrencyPipe]
})
export class MonthlyMoneyReportComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('reportSection') reportSection!: ElementRef;

  reportForm: FormGroup;
  reportData: MonthlyReportResponse | null = null;
  loading = false;

  months: MonthOption[] = [
    { value: 1, name: 'January' }, { value: 2, name: 'February' },
    { value: 3, name: 'March' }, { value: 4, name: 'April' },
    { value: 5, name: 'May' }, { value: 6, name: 'June' },
    { value: 7, name: 'July' }, { value: 8, name: 'August' },
    { value: 9, name: 'September' }, { value: 10, name: 'October' },
    { value: 11, name: 'November' }, { value: 12, name: 'December' }
  ];

  years: number[] = [];
  reportTypes: ReportTypeOption[] = [
    { value: 'room', name: 'Room Monthly Income' },
    { value: 'packages', name: 'Packages Monthly Income' }
  ];

  clinics: string[] = [];
  rooms: Room[] = [];
  filteredRooms: Room[] = [];

  chartData: any[] = [];
  chartView: [number, number] = [700, 400];

  displayedColumns: string[] = ['date', 'type', 'description', 'amount'];

  constructor(
    private fb: FormBuilder,
    private reportsService: ReportsService,
    private roomService: RoomsService,
    private snackBar: MatSnackBar
  ) {
    this.initializeForm();
    this.generateYears();
  }

  ngOnInit(): void {
    this.loadClinics();
    this.loadRooms();
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    const currentDate = new Date();
    this.reportForm = this.fb.group({
      reportType: ['room', Validators.required],
      clinic: [''],
      room: [''],
      month: [currentDate.getMonth() + 1, Validators.required],
      year: [currentDate.getFullYear(), Validators.required]
    });
  }

  private generateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 5; year <= currentYear + 2; year++) {
      this.years.push(year);
    }
  }

  private setupFormSubscriptions(): void {
    this.reportForm.get('clinic')?.valueChanges
      .pipe(startWith(''), debounceTime(300), takeUntil(this.destroy$))
      .subscribe(clinicName => {
        this.loadRooms(clinicName);
        this.reportForm.get('room')?.setValue('');
      });

    this.reportForm.get('reportType')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(reportType => {
        const roomControl = this.reportForm.get('room');
        if (reportType === 'packages') {
          roomControl?.clearValidators();
          roomControl?.setValue('');
          roomControl?.disable();
        } else {
          roomControl?.setValidators([Validators.required]);
          roomControl?.enable();
        }
        roomControl?.updateValueAndValidity();
      });
  }

  private loadClinics(): void {
    this.reportsService.getAllClinics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: clinics => this.clinics = clinics,
        error: err => this.showError('Failed to load clinics')
      });
  }

  private loadRooms(clinicName?: string): void {
    this.roomService.getAllRoomsV2(clinicName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: rooms => { this.rooms = rooms; this.filteredRooms = rooms; },
        error: err => this.showError('Failed to load rooms')
      });
  }

  onGenerateReport(): void {
    if (this.reportForm.invalid) {
      this.markFormGroupTouched();
      return;
    }
    this.loading = true;
    const formValue = this.reportForm.value;

    this.reportsService.getMonthlyMoneyReport({
      month: formValue.month,
      year: formValue.year,
      roomName: formValue.reportType === 'packages' ? null : formValue.room
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          setTimeout(() => {    
            this.reportData = data;
            this.prepareChartData();
            this.loading = false;
          });
          this.showSuccess('Report generated successfully!');
        },
        error: err => {
          this.loading = false;
          this.showError('Failed to generate report');
        }
      });

  }

  private prepareChartData(): void {
    if (!this.reportData) return;
    this.chartData = [
      { name: 'Services Income', value: this.reportData.summary?.servicesIncome || 0 },
      { name: 'Packages Income', value: this.reportData.summary?.packagesIncome || 0 }
    ];
  }

  onResetForm(): void {
    this.reportForm.reset();
    this.initializeForm();
    this.reportData = null;
    this.chartData = [];
  }

  onExportReport(): void {
    const reportElement = this.reportSection?.nativeElement;
    if (!reportElement) {
      this.showError('Report section not found');
      return;
    }
    if (!this.reportData) {
      this.showError('No data available to export');
      return;
    }

    this.snackBar.open('Exporting report as PDF...', '', { duration: 2000 });

    const canvasOptions = { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#fff', removeContainer: true };

    html2canvas(reportElement, canvasOptions).then(canvas => {
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const contentY = 20;
      pdf.addImage(imgData, 'PNG', 10, contentY, imgWidth, imgHeight);

      const filename = `monthly-report-${this.reportData?.month}-${this.reportData?.year}.pdf`;
      pdf.save(filename);
      this.showSuccess('PDF exported successfully!');
    }).catch(err => {
      console.error(err);
      this.showError('Failed to export PDF');
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.reportForm.controls).forEach(key => this.reportForm.get(key)?.markAsTouched());
  }

  private showSuccess(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
  }

  private showError(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
  }

  get isPackageReport(): boolean {
    return this.reportForm.get('reportType')?.value === 'packages';
  }
  get selectedMonth(): string {
    const monthVal = this.reportForm.get('month')?.value;
    return this.months.find(m => m.value === monthVal)?.name || '';
  }
  get totalMoney(): number {
    return this.reportData?.totalMoney || 0;
  }
}
