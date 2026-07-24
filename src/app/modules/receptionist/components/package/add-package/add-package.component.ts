import { PackagePromotionFreeService } from './../../../services/package-service/package.service';
import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

import { ReservationsService } from './../../../services/reservations-services/reservations.service';
import {
  PackagePromotionPreviewResponse,
  PackageService,
  ReservePackagesRequest,
  ReservePackagesRequestItem,
  ReservePackagesRequestTotal,
  ReservePackagesResponse
} from 'src/app/modules/receptionist/services/package-service/package.service';
import { PatientService } from 'src/app/modules/receptionist/services/patient-server/patient.service';
import { AuthService } from 'src/app/shared/services/auth.service';

 const SEARCH_DEBOUNCE_TIME = 300;
const MAX_AUTOCOMPLETE_ITEMS = 50;
const BALANCE_EPSILON = 0.005;

type WizardStep = 1 | 2 | 3;

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

interface CartRow {
  id: number;
  packageName: string;
  unitCost: number;
  quantity: number;
  description?: string;
}

interface ReservationItemSummary {
  packageName: string;
  quantity: number;
  unitCost: number;
  lineTotal: number;
}

interface ReservationData {
  patientPhone: string;
  patientName: string;
  items: ReservationItemSummary[];
  cartTotal: number;
  discountAmount: number;
  discountPercentage: number;
  payableTotal: number;
  appliedRuleNames: string[];
  freeServices: PackagePromotionFreeService[];
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
  reservedIds: number[];
}

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
  packageSearchControl = new FormControl('');

  // Wizard state
  currentStep: WizardStep = 1;
  previewTicketCode = '';

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

  // Cart state
  cart: CartRow[] = [];
  private nextCartId = 1;

  debit: number = 0;

  // Form state
  isSubmitting = false;
  showReceipt = false;
  reservationData?: ReservationData;
  generatedAt: Date = new Date();
  promotionPreview?: PackagePromotionPreviewResponse;
  isPromotionLoading = false;
  promotionError = '';
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
    this.previewTicketCode = this.generateTicketCode();
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.patientSearchSubject.complete();
    this.packageSearchSubject.complete();
  }

  private generateTicketCode(): string {
    return 'RSV-' + Math.floor(100000 + Math.random() * 900000);
  }

  private initializeForm(): void {
    this.packageFm = this.fb.group({
      patientPhone: ['', [Validators.required]],
      cash: [null],
      visa: [null],
      debit: [null],
      credit: [null],
      instaPay: [null],
      vodafoneCash: [null],
    });
  }

  private initializeSearchDebouncing(): void {
    const patientSearchSubscription = this.patientSearchSubject
      .pipe(debounceTime(SEARCH_DEBOUNCE_TIME), distinctUntilChanged())
      .subscribe((searchTerm: string) => {
        this.performPatientSearch(searchTerm);
      });

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
  private fetchPromotionPreview(): void {
    const total = this.getCartTotal();
    if (total <= 0) {
      this.promotionPreview = undefined;
      return;
    }

    this.isPromotionLoading = true;
    this.promotionError = '';
    this.cdr.markForCheck();

    const subscription = this.packageservice.previewPackagePromotions(total)
      .subscribe({
        next: (data) => {
          this.promotionPreview = data;
          this.isPromotionLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.promotionPreview = undefined;
          this.isPromotionLoading = false;
          this.promotionError = err.error?.message || 'Unable to check promotions right now';
          this.cdr.markForCheck();
        }
      });

    this.subscriptions.add(subscription);
  }

  get hasPromotion(): boolean {
    return !!this.promotionPreview && this.promotionPreview.discountAmount > 0;
  }

  get hasAppliedRules(): boolean {
    return !!this.promotionPreview?.appliedRuleIds?.length;
  }

  get hasFreeServices(): boolean {
    return !!this.promotionPreview?.eligibleFreeServices?.length;
  }

  // The total the patient actually owes right now — discounted if a promo applies
  getPayableTotal(): number {
    if (this.hasPromotion && this.promotionPreview) {
      return this.round2(this.promotionPreview.discountedTotal);
    }
    return this.getCartTotal();
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

  get patientSelected(): boolean {
    return !!this.packageFm.get('patientPhone')?.value;
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

  // Cart management
addToCart(pkg: PackageItem): void {
  const newRow: CartRow = {
    id: this.nextCartId++,
    packageName: pkg.packageName,
    unitCost: Number(pkg.packageCost),
    quantity: 1,
    description: pkg.description
  };
  this.cart = [...this.cart, newRow];
  this.snackBar.open(`${pkg.packageName} added to the ticket`, '', { duration: 1500 });
  this.cdr.markForCheck();
}

  removeFromCart(id: number): void {
    this.cart = this.cart.filter(row => row.id !== id);
    this.cdr.markForCheck();
  }

  incrementQuantity(id: number): void {
    this.cart = this.cart.map(row =>
      row.id === id ? { ...row, quantity: row.quantity + 1 } : row
    );
    this.cdr.markForCheck();
  }

  decrementQuantity(id: number): void {
    this.cart = this.cart.map(row =>
      row.id === id && row.quantity > 1 ? { ...row, quantity: row.quantity - 1 } : row
    );
    this.cdr.markForCheck();
  }

  trackByCartRow(index: number, row: CartRow): number {
    return row.id;
  }

  trackByPatient(index: number, item: string): string {
    return item;
  }

  trackByPackage(index: number, item: PackageItem): string {
    return item.packageName;
  }

getLineTotal(row: CartRow): number {
  return this.round2(Number(row.unitCost) * Number(row.quantity));
}

  private round2(n: number): number {
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }

getCartTotal(): number {
  return this.round2(this.cart.reduce((sum, row) => sum + this.getLineTotal(row), 0));
}

  // Utility methods
  extractPatientName(patient: string): string {
    if (!patient) return '';
    const parts = patient.split(/\s*-\s*/);
    const namePart = parts.slice(0, -1).join('-').trim();
    return namePart || patient.trim();
  }

  extractPatientPhone(patient: string): string {
    if (!patient) return '';
    const parts = patient.split(/\s*-\s*/);
    return parts.length > 1 ? parts[parts.length - 1].trim() : '';
  }

  // Payment calculation methods
  getTotalPayments(): number {
    const formValues = this.packageFm.value;
    return this.round2(
      (formValues.cash || 0) +
      (formValues.vodafoneCash || 0) +
      (formValues.visa || 0) +
      (formValues.credit || 0) +
      (formValues.instaPay || 0) +
      (formValues.debit || 0)
    );
  }

  getBalance(): number {
    return this.round2(this.getPayableTotal() - this.getTotalPayments());
  }

  getPaidPercent(): number {
    const total = this.getPayableTotal();
    if (total <= 0) return this.getTotalPayments() > 0 ? 100 : 0;
    return Math.min(100, Math.max(0, (this.getTotalPayments() / total) * 100));
  }

  getBalanceClass(): string {
    const balance = this.getBalance();
    if (balance > BALANCE_EPSILON) return 'text-danger';
    if (balance < -BALANCE_EPSILON) return 'text-warning';
    return 'text-success';
  }

  getBalanceIcon(): string {
    const balance = this.getBalance();
    if (balance > BALANCE_EPSILON) return 'error';
    if (balance < -BALANCE_EPSILON) return 'warning';
    return 'check_circle';
  }

  getBalanceStatus(): string {
    const balance = this.getBalance();
    if (balance > BALANCE_EPSILON) return 'Underpaid';
    if (balance < -BALANCE_EPSILON) return 'Overpaid';
    return 'Paid in Full';
  }

 

  updatePaymentSummary(): void {
    this.cdr.markForCheck();
  }

  get isSuper(): boolean | null {
    return this.authService.isSuper;
  }

  // Wizard navigation
  canProceedToPayment(): boolean {
    return this.patientSelected && this.cart.length > 0;
  }

  canProceedToReview(): boolean {
    const paid = this.getTotalPayments();
    if (this.isSuper) {
      return paid === 0;
    }
    return Math.abs(this.getBalance()) <= BALANCE_EPSILON;
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      if (!this.patientSelected) {
        this.showErrorMessage('Select a patient before continuing');
        return;
      }
      if (this.cart.length === 0) {
        this.showErrorMessage('Add at least one package to the ticket before continuing');
        return;
      }
      this.currentStep = 2;
      this.fetchPromotionPreview();
    } else if (this.currentStep === 2) {
      if (!this.canProceedToReview()) {
        if (this.isSuper) {
          this.showErrorMessage('Super Receptionist reservations must have a total payment of 0');
        } else {
          const balance = this.getBalance();
          this.showErrorMessage(
            balance > 0
              ? 'Total Payments Value is Less Than the Cart Total!!'
              : 'Total Payments Value is More Than the Cart Total!!'
          );
        }
        return;
      }
      this.currentStep = 3;
    }
    this.cdr.markForCheck();
  }
  prevStep(): void {
    if (this.currentStep > 1) {
      if (this.currentStep === 2) {
        // going back to edit the cart — promo total is now stale
        this.promotionPreview = undefined;
        this.promotionError = '';
      }
      this.currentStep = (this.currentStep - 1) as WizardStep;
      this.cdr.markForCheck();
    }
  }

  goToStep(step: WizardStep): void {
    if (step === this.currentStep) return;
    if (step < this.currentStep) {
      if (step === 1) {
        this.promotionPreview = undefined;
        this.promotionError = '';
      }
      this.currentStep = step;
      this.cdr.markForCheck();
      return;
    }
    if (step === 2 && this.canProceedToPayment()) {
      this.currentStep = 2;
      this.fetchPromotionPreview();
    } else if (step === 3 && this.canProceedToPayment() && this.canProceedToReview()) {
      this.currentStep = 3;
    }
    this.cdr.markForCheck();
  }

  

  private buildPackagesPayload(): ReservePackagesRequestItem[] {
    return this.cart.map(row => ({
      packageName: row.packageName,
      quantity: row.quantity
    }));
  }

  private buildTotalPayload(): ReservePackagesRequestTotal {
    const formValues = this.packageFm.value;
    return {
      cash: Number(formValues.cash) || 0,
      visa: Number(formValues.visa) || 0,
      vodafoneCash: Number(formValues.vodafoneCash) || 0,
      debit: Number(formValues.debit) || 0,
      credit: Number(formValues.credit) || 0,
      instaPay: Number(formValues.instaPay) || 0,
     };
  }
   submit(): void {
    if (this.packageFm.invalid) {
      this.markFormGroupTouched(this.packageFm);
      return;
    }

    if (this.cart.length === 0) {
      this.showErrorMessage('Add at least one package to the ticket before reserving');
      return;
    }

    if (!this.canProceedToReview()) {
      if (this.isSuper) {
        this.showErrorMessage('Super Receptionist reservations must have a total payment of 0!');
      } else {
        const balance = this.getBalance();
        this.showErrorMessage(
          balance > 0
            ? 'Total Payments Value is Less Than the Cart Total!!'
            : 'Total Payments Value is More Than the Cart Total!!'
        );
      }
      return;
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();

     const patientPhone = this.namesAndNumbers.extractPhoneNumberFromSearchResult(
       this.packageFm.value.patientPhone
     );

     const requestPayload: ReservePackagesRequest = {
       patientPhone: patientPhone,
       packages: this.buildPackagesPayload(),
       total: this.buildTotalPayload()
     };
    const subscription = this.packageservice.reservePackages(requestPayload)
      .subscribe({
        next: (data: ReservePackagesResponse) => {
          this.isSubmitting = false;
          this.showSuccessMessage(data?.message || 'Packages Reserved Successfully!');

          this.prepareReservationData(data);

          this.showReceipt = true;
          this.cdr.markForCheck();

          this.updatePackagesList();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.cdr.markForCheck();
          console.error("Error in Reserve Packages", err);
          this.showErrorMessage(err.error?.message || 'An error occurred while reserving the packages');
        }
      });

    this.subscriptions.add(subscription);
  }

  private prepareReservationData(response: ReservePackagesResponse): void {
    const patientName = this.extractPatientName(this.patientSearchValue);
    const patientPhone = this.extractPatientPhone(this.patientSearchValue);
    const formValues = this.packageFm.value;

    this.reservationData = {
      patientPhone: patientPhone,
      patientName: patientName,
      items: this.cart.map(row => ({
        packageName: row.packageName,
        quantity: row.quantity,
        unitCost: row.unitCost,
        lineTotal: this.getLineTotal(row)
      })),
      cartTotal: this.getCartTotal(),
      discountAmount: this.hasPromotion ? (this.promotionPreview?.discountAmount || 0) : 0,
      discountPercentage: this.hasPromotion ? (this.promotionPreview?.discountPercentage || 0) : 0,
      payableTotal: this.getPayableTotal(),
      appliedRuleNames: this.hasPromotion
        ? (this.promotionPreview?.appliedRuleIds.map(r => r.ruleName) || [])
        : [],
      freeServices: this.hasPromotion
        ? (this.promotionPreview?.eligibleFreeServices || [])
        : [],
      paymentMethods: {
        cash: formValues.cash,
        visa: formValues.visa,
        debit: formValues.debit,
        credit: formValues.credit,
        instaPay: formValues.instaPay,
        vodafoneCash: formValues.vodafoneCash
      },
      totalPayments: this.getTotalPayments(),
      reservationDate: new Date(),
      reservedIds: response.reservedIds || []
    };

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
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const logoImg = new Image();
      logoImg.onload = () => {
        pdf.addImage(logoImg, 'PNG', 10, 10, 30, 30);

        let y = 50;

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
              position = 10;
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
    this.currentStep = 1;
    this.cart = [];
    this.packageFm.reset();
    this.previewTicketCode = this.generateTicketCode();
    this.promotionPreview = undefined;
    this.promotionError = '';
    this.cdr.markForCheck();
  }
}