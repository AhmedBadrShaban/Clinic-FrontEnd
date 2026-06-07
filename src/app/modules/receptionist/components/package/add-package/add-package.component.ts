import {
  Component,
  ViewEncapsulation,
  Inject,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

import { ReservationsService } from './../../../services/reservations-services/reservations.service';
import { PackageService } from 'src/app/modules/receptionist/services/package-service/package.service';
import { PatientService } from 'src/app/modules/receptionist/services/patient-server/patient.service';
import { AuthService } from 'src/app/shared/services/auth.service';


interface PatientSearchItem {
  displayText: string;
  phoneNumber: string;
  name: string;
}

interface PackageItem {
  packageName: string;
  packageCost: number;
  description?: string;
}

interface ReservationData {
  patientPhone: string;
  patientName: string;
  packageName: string;
  packageCost: number;
  paymentMethods: {
    cash?: number;
    visa?: number;
    debit?: number;
    credit?: number;
    instaPay?: number;
    vodafoneCash?: number;
  };
  totalPayments: number;
  reservationDate: Date;
}

const SEARCH_DEBOUNCE_TIME = 300;
const MAX_AUTOCOMPLETE_ITEMS = 50;

@Component({
  selector: 'app-add-package',
  templateUrl: './add-package.component.html',
  styleUrls: ['./add-package.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPackageComponent implements OnInit, OnDestroy {
  @ViewChild('receiptSection', { static: false }) receiptSection?: ElementRef;

  packageFm: FormGroup;

  // Patient search properties
  patientSearchValue = '';
  isPatientLoading = false;
  allPatientsData: PatientSearchItem[] = [];
  filteredPatients: string[] = [];

  // Package search properties
  packageSearchValue = '';
  isPackageLoading = false;
  AllPackages: PackageItem[] = [];
  filteredPackages: PackageItem[] = [];
  debit: number = 0;
  // Form state
  isSubmitting = false;
  showReceipt = false;
  reservationData?: ReservationData;
  generatedAt: Date = new Date();

  // Search subjects for debouncing
  private patientSearchSubject = new Subject<string>();
  private packageSearchSubject = new Subject<string>();
  private subscriptions = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<AddPackageComponent>,
    private fb: FormBuilder,
    private namesAndNumbers: ReservationsService,
    private patientservice: PatientService,
    private authService: AuthService,
    private packageservice: PackageService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {
    this.initializeForm();
    this.initializeSearchDebouncing();
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.patientSearchSubject.complete();
    this.packageSearchSubject.complete();
  }

  private initializeForm(): void {
    this.packageFm = this.fb.group({
      patientPhone: ['', [Validators.required]],
      packageName: ['', [Validators.required]],
      packageCost: ['0'],
      cash: [null],
      visa: [null],
      debit: [null],
      credit: [null],
      instaPay: [null],
      vodafoneCash: [null],
    });
  }

  private initializeSearchDebouncing(): void {
    // Patient search debouncing
    const patientSearchSubscription = this.patientSearchSubject
      .pipe(debounceTime(SEARCH_DEBOUNCE_TIME), distinctUntilChanged())
      .subscribe((searchTerm: string) => {
        this.performPatientSearch(searchTerm);
      });

    // Package search debouncing
    const packageSearchSubscription = this.packageSearchSubject
      .pipe(debounceTime(SEARCH_DEBOUNCE_TIME), distinctUntilChanged())
      .subscribe((searchTerm: string) => {
        this.performPackageSearch(searchTerm);
      });

    this.subscriptions.add(patientSearchSubscription);
    this.subscriptions.add(packageSearchSubscription);
  }

  private loadInitialData(): void {
    this.loadPatientsData();
    this.loadPackagesData();
  }

  private loadPatientsData(): void {
    this.isPatientLoading = true;
    this.cdr.markForCheck();

    const subscription = this.namesAndNumbers.getPatientsNamesAndPhonesAuto(0)
      .subscribe({
        next: (data: any) => {
          if (Array.isArray(data)) {
            this.allPatientsData = this.transformPatientData(data);
            this.filteredPatients = this.allPatientsData
              .slice(0, MAX_AUTOCOMPLETE_ITEMS)
              .map(item => item.displayText);
          }
          this.isPatientLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading patients:', error);
          this.isPatientLoading = false;
          this.cdr.markForCheck();
        }
      });

    this.subscriptions.add(subscription);
  }

  private loadPackagesData(): void {
    this.isPackageLoading = true;
    this.cdr.markForCheck();

    const subscription = this.packageservice.getAllPackages()
      .subscribe({
        next: (data: any) => {
          this.AllPackages = data;
          this.filteredPackages = [...this.AllPackages];
          this.isPackageLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading packages:', error);
          this.isPackageLoading = false;
          this.cdr.markForCheck();
        }
      });

    this.subscriptions.add(subscription);
  }

  private transformPatientData(rawData: any[]): PatientSearchItem[] {
    if (!Array.isArray(rawData)) return [];

    return rawData.map(item => {
      if (typeof item === 'string') {
        const parts = item.split(' - ');
        return {
          displayText: item,
          name: parts[0]?.trim() || '',
          phoneNumber: parts[1]?.trim() || ''
        };
      }

      return {
        displayText: `${item.name} - ${item.phoneNumber}`,
        name: item.name || '',
        phoneNumber: item.phoneNumber || ''
      };
    });
  }

  // Patient search methods
  onPatientSearch(event: any): void {
    const value = event.target.value;
    this.patientSearchValue = value;
    this.patientSearchSubject.next(value);
  }

  private performPatientSearch(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredPatients = this.allPatientsData
        .slice(0, MAX_AUTOCOMPLETE_ITEMS)
        .map(item => item.displayText);
      this.cdr.markForCheck();
      return;
    }

    this.isPatientLoading = true;

    const subscription = this.namesAndNumbers.getPatientsNamesAndPhonesAuto(searchTerm)
      .subscribe({
        next: (data: any) => {
          this.allPatientsData = this.transformPatientData(data);
          const lowerSearchTerm = searchTerm.toLowerCase();
          const filtered = this.allPatientsData
            .filter(item =>
              item.name.toLowerCase().includes(lowerSearchTerm) ||
              item.phoneNumber.includes(searchTerm)
            )
            .slice(0, MAX_AUTOCOMPLETE_ITEMS)
            .map(item => item.displayText);

          this.filteredPatients = filtered;
          this.isPatientLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error during patient search:', error);
          this.filteredPatients = [];
          this.isPatientLoading = false;
          this.cdr.markForCheck();
        }
      });

    this.subscriptions.add(subscription);
  }

  onPatientSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.value as string;
    this.patientSearchValue = selectedValue;
    this.packageFm.patchValue({ patientPhone: selectedValue });
  }

  // Package search methods
  onPackageSearch(event: any): void {
    const value = event.target.value;
    this.packageSearchValue = value;
    this.packageSearchSubject.next(value);
  }

  private performPackageSearch(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredPackages = [...this.AllPackages];
      this.cdr.markForCheck();
      return;
    }

    this.filteredPackages = this.AllPackages.filter(pkg =>
      pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.cdr.markForCheck();
  }

  onPackageSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedPackageName = event.option.value as string;
    const selectedPackage = this.AllPackages.find(pkg => pkg.packageName === selectedPackageName);

    this.packageSearchValue = selectedPackageName;
    this.packageFm.patchValue({
      packageName: selectedPackageName,
      packageCost: selectedPackage ? selectedPackage.packageCost : 0
    });

    this.updatePaymentSummary();
  }

  // Utility methods
  extractPatientName(patient: string): string {
    if (!patient) return '';

    // Split by hyphen with or without spaces
    const parts = patient.split(/\s*-\s*/);

    // Everything before the last "-" is considered name
    const namePart = parts.slice(0, -1).join('-').trim();

    return namePart || patient.trim();
  }

  extractPatientPhone(patient: string): string {
    if (!patient) return '';

    // Split by hyphen with or without spaces
    const parts = patient.split(/\s*-\s*/);

    // Last part after "-" is the phone
    return parts.length > 1 ? parts[parts.length - 1].trim() : '';
  }

  // Track by functions for performance
  trackByPatient(index: number, item: string): string {
    return item;
  }

  trackByPackage(index: number, item: PackageItem): string {
    return item.packageName;
  }

  // Payment calculation methods
  getTotalPayments(): number {
    const formValues = this.packageFm.value;
    return (formValues.cash || 0) +
      (formValues.vodafoneCash || 0) +
      (formValues.visa || 0) +
      (formValues.credit || 0) +
      (formValues.instaPay || 0) +
      (formValues.debit || 0);
  }

  getPackageCost(): number {
    return this.packageFm.get('packageCost')?.value || 0;
  }

  getBalance(): number {
    const packageCost = this.getPackageCost();
    const payments = this.getTotalPayments();
    return packageCost - payments;
  }

  getBalanceClass(): string {
    const balance = this.getBalance();
    if (balance > 0) return 'text-danger'; // Underpaid
    if (balance < 0) return 'text-warning'; // Overpaid
    return 'text-success'; // Exact payment
  }

  getBalanceColor(): string {
    const balance = this.getBalance();
    if (balance > 0) return 'warn'; // Underpaid
    if (balance < 0) return 'accent'; // Overpaid
    return 'primary'; // Exact payment
  }

  getBalanceIcon(): string {
    const balance = this.getBalance();
    if (balance > 0) return 'error'; // Underpaid
    if (balance < 0) return 'warning'; // Overpaid
    return 'check_circle'; // Exact payment
  }

  getBalanceStatus(): string {
    const balance = this.getBalance();
    if (balance > 0) return 'Underpaid';
    if (balance < 0) return 'Overpaid';
    return 'Paid in Full';
  }

  updatePaymentSummary(): void {
    this.cdr.markForCheck();
  }

  // Form submission
  submit(): void {
    if (this.packageFm.invalid) {
      this.markFormGroupTouched(this.packageFm);
      return;
    }

    const formData = this.packageFm.value;
    const totalPayments = this.getTotalPayments();
    const packageCost = this.getPackageCost();

    if (this.isSuper) {
      // Super user: total payments must be exactly 0
      if (totalPayments !== 0) {
        this.showErrorMessage("Super user reservations must have a total payment of 0!");
        return;
      }
    } else {
      // Regular user: total payments must match package cost exactly
      if (packageCost > totalPayments) {
        this.showErrorMessage("Total Payments Value is Less Than the Package Cost!!");
        return;
      } else if (packageCost < totalPayments) {
        this.showErrorMessage("Total Payments Value is More Than the Package Cost!!");
        return;
      }
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();

    // Extract phone number from search result
    formData.patientPhone = this.namesAndNumbers.extractPhoneNumberFromSearchResult(formData.patientPhone);

    const subscription = this.packageservice.reservePackage(formData)
      .subscribe({
        next: (data: any) => {
          this.isSubmitting = false;
          this.showSuccessMessage("Package Reserved Successfully!");

          // Prepare reservation data for receipt
          this.prepareReservationData(formData);

          // Show receipt and generate PDF
          this.showReceipt = true;
          this.cdr.markForCheck();

          this.updatePackagesList();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.cdr.markForCheck();
          console.error("Error in Reserve a Package", err);
          this.showErrorMessage(err.error?.message || 'An error occurred while reserving the package');
        }
      });

    this.subscriptions.add(subscription);
  }
  get isSuper(): boolean | null {
    return this.authService.isSuper;
  }

  private prepareReservationData(formData: any): void {
    const patientName = this.extractPatientName(this.patientSearchValue);
    const patientPhone = this.extractPatientPhone(this.patientSearchValue);

    this.reservationData = {
      patientPhone: patientPhone,
      patientName: patientName,
      packageName: formData.packageName,
      packageCost: formData.packageCost,
      paymentMethods: {
        cash: formData.cash,
        visa: formData.visa,
        debit: formData.debit,
        credit: formData.credit,
        instaPay: formData.instaPay,
        vodafoneCash: formData.vodafoneCash
      },
      totalPayments: this.getTotalPayments(),
      reservationDate: new Date()
    };
    console.log('reservationData', this.reservationData)
    // Generate PDF after a short delay to ensure DOM is rendered
    setTimeout(() => {
      this.generatePDF();
    }, 500);

  }

  generatePDF(): void {
    const receiptElement = this.receiptSection?.nativeElement;
    if (!receiptElement) {
      this.showErrorMessage('Receipt section not found');
      return;
    }

    if (!this.reservationData) {
      this.showErrorMessage('No reservation data available to generate PDF');
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

   html2canvas(receiptElement, canvasOptions).then((canvas) => {
  const imgData = canvas.toDataURL('image/png', 1.0);
  const pdf = new jsPDF('p', 'mm', 'a4');

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth - 20; // margins
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const logoImg = new Image();
  logoImg.onload = () => {
    // Draw logo
    pdf.addImage(logoImg, 'PNG', 10, 10, 30, 30);

    // Place receipt below logo (leave space, e.g., 50mm)
    let y = 50;

    // If content too tall for one page, split across pages
    if (imgHeight > pdfHeight - y - 10) {
      let remainingHeight = imgHeight;
      let position = y;

      while (remainingHeight > 0) {
        pdf.addImage(
          imgData,
          'PNG',
          10,
          position,
          imgWidth,
          imgHeight
        );
        remainingHeight -= pdfHeight - y;
        if (remainingHeight > 0) {
          pdf.addPage();
          position = 10; // reset top margin for new page
        }
      }
    } else {
      pdf.addImage(imgData, 'PNG', 10, y, imgWidth, imgHeight);
    }

    const dateStr = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || 'receipt';
const patientName = this.reservationData?.patientName
  ? this.extractPatientName(this.reservationData.patientName)
  : 'Patient';
  pdf.save(`package-receipt-${patientName}-${dateStr}.pdf`);
  };

  logoImg.src = 'assets/logo.png';
});

  }

  getPaymentMethodsUsed(): Array<{ method: string, amount: number }> {
    if (!this.reservationData) return [];

    const payments = this.reservationData.paymentMethods;
    const usedMethods: Array<{ method: string, amount: number }> = [];

    if (payments.cash && payments.cash > 0) {
      usedMethods.push({ method: 'Cash', amount: payments.cash });
    }
    if (payments.visa && payments.visa > 0) {
      usedMethods.push({ method: 'Visa', amount: payments.visa });
    }
    if (payments.debit && payments.debit > 0) {
      usedMethods.push({ method: 'Debit', amount: payments.debit });
      this.debit = payments.debit;
    }
    if (payments.credit && payments.credit > 0) {
      usedMethods.push({ method: 'Credit', amount: payments.credit });
    }
    if (payments.instaPay && payments.instaPay > 0) {
      usedMethods.push({ method: 'InstaPay', amount: payments.instaPay });
    }
    if (payments.vodafoneCash && payments.vodafoneCash > 0) {
      usedMethods.push({ method: 'Vodafone Cash', amount: payments.vodafoneCash });
    }

    return usedMethods;
  }

  regeneratePDF(): void {
    this.generatePDF();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private updatePackagesList(): void {
    const subscription = this.packageservice.getAllReservedPackages()
      .subscribe({
        next: (data: any) => {
          this.packageservice.updateListOfData(data);
        },
        error: (error) => {
          console.error('Error updating packages list:', error);
        }
      });

    this.subscriptions.add(subscription);
  }
  get userType(): string | null {
    return this.authService.userType;
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

  backToForm(): void {
    this.showReceipt = false;
    this.cdr.markForCheck();
  }
}