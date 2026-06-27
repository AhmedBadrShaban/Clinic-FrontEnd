import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
 import { RoomsService, Room } from 'src/app/modules/Services/rooms/rooms.service';
import { MonthlyReportResponse, ReportsService } from '../../../services/reports/reports.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
interface MonthOption { value: number; name: string; }
interface ReportTypeOption { value: string; name: string; }

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class MonthlyMoneyReportComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('reportSection') reportSection!: ElementRef;

  /* ── form ── */
  reportForm: FormGroup;

  /* ── collapse ── */
  filtersCollapsed = false;

  /* ── lookup data ── */
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

  /* ── room autocomplete (mirrors clinic autocomplete in debit-movements) ── */
  allRooms: Room[] = [];
  filteredRooms: Room[] = [];
  roomSearchInput = '';
  hasRoomFilter = false;

  /* ── result ── */
  reportData: MonthlyReportResponse | null = null;
  loading = false;

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
    this.loadRooms();
    this.setupReportTypeSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* ── form setup ── */
  private initializeForm(): void {
    const now = new Date();
    this.reportForm = this.fb.group({
      reportType: ['room', Validators.required],
      room: ['', Validators.required],  // holds selected roomName string
      month: [now.getMonth() + 1, Validators.required],
      year: [now.getFullYear(), Validators.required]
    });
  }

  private generateYears(): void {
    const current = new Date().getFullYear();
    for (let y = current - 5; y <= current + 2; y++) this.years.push(y);
  }

  private setupReportTypeSubscription(): void {
    this.reportForm.get('reportType')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => {
        const roomCtrl = this.reportForm.get('room')!;
        if (type === 'packages') {
          roomCtrl.clearValidators();
          roomCtrl.setValue('');
          roomCtrl.disable();
          this.clearRoomFilter();
        } else {
          roomCtrl.setValidators([Validators.required]);
          roomCtrl.enable();
        }
        roomCtrl.updateValueAndValidity();
        this.reportData = null;
      });
  }

  private loadRooms(): void {
    this.roomService.getAllRoomsV2()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: rooms => { this.allRooms = rooms; this.filteredRooms = rooms; },
        error: () => this.showError('Failed to load rooms')
      });
  }

  /* ── room autocomplete handlers (exact same pattern as onClinicSearch / onClinicSelected) ── */
  onRoomSearch(value: string): void {
    this.roomSearchInput = value;
    if (!value.trim()) { this.clearRoomFilter(); return; }
    const q = value.toLowerCase().trim();
    this.filteredRooms = this.allRooms.filter(r =>
      r.roomName.toLowerCase().includes(q) ||
      (r.clinicName?.toLowerCase().includes(q) ?? false)
    );
  }

  onRoomSelected(room: Room): void {
    this.roomSearchInput = room.roomName;
    this.hasRoomFilter = true;
    this.reportForm.get('room')!.setValue(room.roomName);
    this.filteredRooms = [...this.allRooms];
  }

  clearRoomFilter(): void {
    this.roomSearchInput = '';
    this.hasRoomFilter = false;
    this.filteredRooms = [...this.allRooms];
    this.reportForm.get('room')!.setValue('');
  }

  /* ── generate ── */
  onGenerateReport(): void {
    if (this.reportForm.invalid) {
      Object.keys(this.reportForm.controls).forEach(k => this.reportForm.get(k)!.markAsTouched());
      return;
    }

    this.loading = true;
    const fv = this.reportForm.getRawValue();

    this.reportsService.getMonthlyMoneyReport({
      month: fv.month,
      year: fv.year,
      roomName: fv.reportType === 'packages' ? undefined : fv.room
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.reportData = data;
          this.loading = false;
          this.showSuccess('Report generated successfully!');
        },
        error: () => {
          this.loading = false;
          this.showError('Failed to generate report');
        }
      });
  }
  onExportPdf(): void {
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

    const canvasOptions = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#fff',
      removeContainer: true
    };

    html2canvas(reportElement, canvasOptions).then(canvas => {
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight);

      const filename = `monthly-report-${this.reportData?.month}-${this.reportData?.year}.pdf`;
      pdf.save(filename);
      this.showSuccess('PDF exported successfully!');
    }).catch(err => {
      console.error(err);
      this.showError('Failed to export PDF');
    });
  }

  onResetForm(): void {
    this.initializeForm();
    this.clearRoomFilter();
    this.reportData = null;
  }

  /* ── helpers ── */
  private showSuccess(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
  }
  private showError(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
  }

  get isPackageReport(): boolean {
    return this.reportForm.get('reportType')?.value === 'packages';
  }
  get isGenerateDisabled(): boolean {
    if (this.loading) return true;
    const fv = this.reportForm.getRawValue();
    if (!fv.month || !fv.year) return true;
    if (fv.reportType === 'room' && !fv.room) return true;
    return false;
  }
  get selectedMonth(): string {
    const v = this.reportForm.get('month')?.value;
    return this.months.find(m => m.value === v)?.name ?? '';
  }
}