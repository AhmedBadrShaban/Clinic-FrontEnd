import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe, NgIf, NgFor, CurrencyPipe } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Subscription } from 'rxjs';
import { PackageService } from 'src/app/modules/receptionist/services/package-service/package.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface PackageReceiptData {
  reservedId: string | number;
}

@Component({
    selector: 'app-package-receipt-dialog',
    templateUrl: './package-receipt-dialog.component.html',
    styleUrls: ['./package-receipt-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, MatProgressSpinnerModule, MatIconModule, MatButtonModule, NgFor, CurrencyPipe, DatePipe]
})
export class PackageReceiptDialogComponent implements OnInit, OnDestroy {
  @ViewChild('receiptSection', { static: false }) receiptSection?: ElementRef;

  receiptData: any = null;
  isLoading = true;
  hasError = false;
  isGeneratingPdf = false;

  private subscriptions = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PackageReceiptData,
    private dialogRef: MatDialogRef<PackageReceiptDialogComponent>,
    private packageService: PackageService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.fetchReceiptData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private fetchReceiptData(): void {
    this.isLoading = true;
    this.hasError = false;
    this.cdr.markForCheck();

    const sub = this.packageService.getReservedPackagePaymentDetails(this.data.reservedId)
      .subscribe({
        next: (data: any) => {
          this.receiptData = data;
          this.isLoading = false;
          this.cdr.markForCheck();

 
        },
        error: (err) => {
          console.error('Error fetching receipt data:', err);
          this.hasError = true;
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });

    this.subscriptions.add(sub);
  }

  /** Returns only payment methods with amount > 0 */
  getUsedPaymentMethods(): Array<{ label: string; amount: number }> {
    if (!this.receiptData?.paymentFactors) return [];

    const pf = this.receiptData.paymentFactors;
    const methods = [
      { label: 'Cash', amount: pf.cash },
      { label: 'Visa', amount: pf.visa },
      { label: 'Vodafone Cash', amount: pf.vodafoneCash },
      { label: 'Debit', amount: pf.debit },
      { label: 'Credit', amount: pf.credit },
      { label: 'InstaPay', amount: pf.instaPay },
    ];

    return methods.filter(m => m.amount && m.amount > 0);
  }

  generatePDF(silent = false): void {
    const el = this.receiptSection?.nativeElement;
    if (!el || !this.receiptData) {
      if (!silent) this.snackBar.open('Receipt not ready yet', 'Close', { duration: 3000 });
      return;
    }

    this.isGeneratingPdf = true;
    this.cdr.markForCheck();

    if (!silent) {
      this.snackBar.open('Generating PDF…', '', { duration: 2000 });
    }

    html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const logoImg = new Image();
      logoImg.onload = () => {
        // Logo top-left
        pdf.addImage(logoImg, 'PNG', 10, 8, 28, 28);

        const startY = 45;
        let remainingHeight = imgHeight;
        let positionY = startY;

        while (remainingHeight > 0) {
          pdf.addImage(imgData, 'PNG', 10, positionY, imgWidth, imgHeight);
          remainingHeight -= (pdfHeight - startY - 10);
          if (remainingHeight > 0) {
            pdf.addPage();
            positionY = 10;
          }
        }

        const dateStr = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || 'receipt';
        const patientName = (this.receiptData?.patientName || 'patient')
          .replace(/\s+/g, '-')
          .toLowerCase();

        pdf.save(`package-receipt-${patientName}-${dateStr}.pdf`);

        this.isGeneratingPdf = false;
        this.cdr.markForCheck();
      };

      logoImg.onerror = () => {
        // Fallback: generate PDF without logo
        const startY = 15;
        pdf.addImage(imgData, 'PNG', 10, startY, imgWidth, imgHeight);

        const dateStr = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || 'receipt';
        const patientName = (this.receiptData?.patientName || 'patient')
          .replace(/\s+/g, '-')
          .toLowerCase();

        pdf.save(`package-receipt-${patientName}-${dateStr}.pdf`);

        this.isGeneratingPdf = false;
        this.cdr.markForCheck();
      };

      logoImg.src = 'assets/logo.png';
    }).catch(err => {
      console.error('PDF generation error:', err);
      this.snackBar.open('Failed to generate PDF', 'Close', { duration: 3000 });
      this.isGeneratingPdf = false;
      this.cdr.markForCheck();
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}