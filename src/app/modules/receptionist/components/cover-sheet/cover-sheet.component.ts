import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CoverSheet } from 'src/app/modules/receptionist/models/cover-sheet';
import { CoverSheetService } from '../../services/cover-sheet/cover-sheet.service';
import { DatePipe } from '@angular/common';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cover-sheet',
  templateUrl: './cover-sheet.component.html',
  styleUrls: ['./cover-sheet.component.css']
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

  ngOnInit(): void {
    // Component initialization
  }

  /**
   * Handles date change events from the date picker
   */
  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      this.selectedDate = event.value;
      this.loadCoverSheetData();
    }
  }

  /**
   * Loads cover sheet data for the selected date
   */
  private loadCoverSheetData(): void {
    if (!this.selectedDate) return;

    this.isLoading = true;
    const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');

    if (!formattedDate) {
      this.showErrorMessage('Invalid date selected');
      this.isLoading = false;
      return;
    }

    this.coverSheetService.getAllSheets(formattedDate).subscribe({
      next: (data: CoverSheet) => {
        this.listOfData = data;
        this.isLoading = false;
        console.log('Cover sheet data loaded:', this.listOfData);
      },
      error: (error) => {
        console.error('Error loading cover sheet data:', error);
        this.showErrorMessage('Failed to load cover sheet data');
        this.isLoading = false;
        this.listOfData = null;
      }
    });
  }

  /**
   * Generates and downloads PDF report
   */
  generatePDF(): void {
    const reportElement = this.reportSection?.nativeElement;

    if (!reportElement) {
      this.showErrorMessage('Report section not found');
      return;
    }

    if (!this.listOfData) {
      this.showErrorMessage('No data available to generate PDF');
      return;
    }

    this.snackBar.open('Generating PDF...', '', { duration: 2000 });

    // Configure html2canvas options for better quality
    const canvasOptions = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      removeContainer: true
    };

    html2canvas(reportElement, canvasOptions).then((canvas) => {
      try {
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Calculate dimensions to fit the page
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth - 20; // 10mm margin on each side
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add logo if available
        const logoImg = new Image();
        logoImg.onload = () => {
          // Add logo to PDF
          pdf.addImage(logoImg, 'PNG', 10, 10, 30, 30);

          // Add main content
          const contentY = imgHeight > (pdfHeight - 60) ? 50 : 50;
          if (imgHeight > (pdfHeight - 60)) {
            // If content is too tall, add new page
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
          } else {
            pdf.addImage(imgData, 'PNG', 10, contentY, imgWidth, imgHeight);
          }

          // Generate filename with date
          const dateStr = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd') || 'report';
          const filename = `cover-sheet-${dateStr}.pdf`;

          pdf.save(filename);
          this.showSuccessMessage('PDF generated successfully!');
        };

        logoImg.onerror = () => {
          // Fallback without logo
          const contentY = 20;
          if (imgHeight > (pdfHeight - 40)) {
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
          } else {
            pdf.addImage(imgData, 'PNG', 10, contentY, imgWidth, imgHeight);
          }

          const dateStr = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd') || 'report';
          const filename = `cover-sheet-${dateStr}.pdf`;

          pdf.save(filename);
          this.showSuccessMessage('PDF generated successfully!');
        };

        // Try to load logo
        logoImg.src = '../../../../../assets/logo.png';

      } catch (error) {
        console.error('Error generating PDF:', error);
        this.showErrorMessage('Failed to generate PDF');
      }
    }).catch((error) => {
      console.error('Error capturing canvas:', error);
      this.showErrorMessage('Failed to capture report content');
    });
  }

  /**
   * Shows success message using Material snackbar
   */
  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  /**
   * Shows error message using Material snackbar
   */
  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  /**
   * Refreshes the current data
   */
  refreshData(): void {
    this.loadCoverSheetData();
    this.snackBar.open('Data refreshed', '', { duration: 2000 });
  }

  /**
   * Checks if financial data is available
   */
  hasFinancialData(): boolean {
    return !!(this.listOfData?.expenses || this.listOfData?.profit || this.listOfData?.net);
  }

  /**
   * Checks if laser read data is available
   */
  hasLaserReadData(): boolean {
    return !!(this.listOfData?.laserRead && this.listOfData.laserRead.length > 0);
  }
}