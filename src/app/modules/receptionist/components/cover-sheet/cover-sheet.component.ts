import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CoverSheet, CoverSheetService } from '../../services/cover-sheet/cover-sheet.service';
import { DatePipe, NgIf, NgFor, CurrencyPipe } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-cover-sheet',
    templateUrl: './cover-sheet.component.html',
    styleUrls: ['./cover-sheet.component.css'],
    standalone: true,
    imports: [MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, MatDatepickerModule, NgIf, MatProgressSpinnerModule, NgFor, MatButtonModule, CurrencyPipe]
})
export class CoverSheetComponent implements OnInit {
  selectedDate: Date | undefined;
  listOfData: CoverSheet | null = null;
  isLoading = false;

  @ViewChild('reportSection', { static: false }) reportSection!: ElementRef;

  constructor(
    private coverSheetService: CoverSheetService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar
  ) {
    this.selectedDate = new Date();
    this.loadCoverSheetData();
  }

  ngOnInit(): void {}

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      this.selectedDate = event.value;
      this.loadCoverSheetData();
    }
  }

  private loadCoverSheetData(): void {
    if (!this.selectedDate) return;
    this.isLoading = true;
    const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    if (!formattedDate) {
      this.showError('Invalid date selected');
      this.isLoading = false;
      return;
    }
    this.coverSheetService.getAllSheets(formattedDate).subscribe({
      next: (data: CoverSheet | null) => {
        this.listOfData = data ?? null;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading cover sheet:', err);
        this.showError('Failed to load cover sheet data');
        this.isLoading = false;
        this.listOfData = null;
      }
    });
  }

  generatePDF(): void {
    const reportEl = this.reportSection?.nativeElement;
    if (!reportEl)        { this.showError('Report section not found'); return; }
    if (!this.listOfData) { this.showError('No data to export'); return; }

    this.snackBar.open('Generating PDF…', '', { duration: 2000 });

    html2canvas(reportEl, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#f5f7fa' })
      .then((canvas) => {
        try {
          const imgData = canvas.toDataURL('image/png', 1.0);
          const pdf     = new jsPDF('p', 'mm', 'a4');
          const pdfW    = pdf.internal.pageSize.getWidth();
          const pdfH    = pdf.internal.pageSize.getHeight();
          const imgW    = pdfW - 20;
          const imgH    = (canvas.height * imgW) / canvas.width;

          if (imgH > pdfH - 25) {
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, 10, imgW, imgH);
          } else {
            pdf.addImage(imgData, 'PNG', 10, 15, imgW, imgH);
          }

          const dateStr = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd') || 'report';
          pdf.save(`cover-sheet-${dateStr}.pdf`);
          this.showSuccess('PDF generated successfully!');
        } catch (err) {
          console.error('PDF error:', err);
          this.showError('Failed to generate PDF');
        }
      })
      .catch((err) => {
        console.error('Canvas error:', err);
        this.showError('Failed to capture report');
      });
  }

  refreshData(): void {
    this.loadCoverSheetData();
    this.snackBar.open('Data refreshed', '', { duration: 1500 });
  }

  hasFinancialData(): boolean {
    return !!(this.listOfData?.expenses || this.listOfData?.profit || this.listOfData?.net);
  }

  hasLaserReadData(): boolean {
    return !!(this.listOfData?.laserRead?.length);
  }

  private showSuccess(msg: string): void {
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  private showError(msg: string): void {
    this.snackBar.open(msg, 'Close', {
      duration: 4000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}