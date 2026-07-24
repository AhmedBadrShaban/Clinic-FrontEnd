import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy
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
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

import { MaterialsService } from 'src/app/modules/admin/services/materials/materials.service';
import { PatientService } from 'src/app/modules/receptionist/services/patient-server/patient.service';
import { ReservationsService } from '../../../services/reservations-services/reservations.service';

const SEARCH_DEBOUNCE_TIME = 300;
const MAX_AUTOCOMPLETE_ITEMS = 50;
const BALANCE_EPSILON = 0.005;

type WizardStep = 1 | 2 | 3;

interface PatientSearchItem {
  displayText: string;
  phoneNumber: string;
  name: string;
}

interface ProductItem {
  materialName: string;
  cost: number;
}

interface CartRow {
  id: number;
  productName: string;
  unitCost: number;
  quantity: number;
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductComponent implements OnInit, OnDestroy {
  productFm: FormGroup;
  productSearchControl = new FormControl('');

  // Wizard state
  currentStep: WizardStep = 1;

  // Patient search properties
  patientSearchValue = '';
  isPatientLoading = false;
  allPatientsData: PatientSearchItem[] = [];
  filteredPatients: string[] = [];

  // Product search properties
  productSearchValue = '';
  isProductLoading = false;
  AllProducts: ProductItem[] = [];
  filteredProducts: ProductItem[] = [];

  // Cart state
  cart: CartRow[] = [];
  private nextCartId = 1;

  // Form state
  isSubmitting = false;

  private patientSearchSubject = new Subject<string>();
  private productSearchSubject = new Subject<string>();
  private subscriptions = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<AddProductComponent>,
    private fb: FormBuilder,
    private namesAndNumbers: ReservationsService,
    private patientservice: PatientService,
    private productservice: MaterialsService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
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
    this.productSearchSubject.complete();
  }

  private initializeForm(): void {
    this.productFm = this.fb.group({
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

    const productSearchSubscription = this.productSearchSubject
      .pipe(debounceTime(SEARCH_DEBOUNCE_TIME), distinctUntilChanged())
      .subscribe((searchTerm: string) => {
        this.performProductSearch(searchTerm);
      });

    this.subscriptions.add(patientSearchSubscription);
    this.subscriptions.add(productSearchSubscription);
  }

  private loadInitialData(): void {
    this.loadPatientsData();
    this.loadProductsData();
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

  private loadProductsData(): void {
    this.isProductLoading = true;
    this.cdr.markForCheck();

    const subscription = this.productservice.getAllMaterials()
      .subscribe({
        next: (data: any) => {
          this.AllProducts = data;
          this.filteredProducts = [...this.AllProducts];
          this.isProductLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.isProductLoading = false;
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
    this.productFm.patchValue({ patientPhone: selectedValue });
  }

  get patientSelected(): boolean {
    return !!this.productFm.get('patientPhone')?.value;
  }

  // Product search methods
  onProductSearch(event: any): void {
    const value = event.target.value;
    this.productSearchValue = value;
    this.productSearchSubject.next(value);
  }

  private performProductSearch(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredProducts = [...this.AllProducts];
      this.cdr.markForCheck();
      return;
    }

    this.filteredProducts = this.AllProducts.filter(product =>
      product.materialName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.cdr.markForCheck();
  }

  // Cart management
  addToCart(product: ProductItem): void {
    const existingRow = this.cart.find(row => row.productName === product.materialName);

    if (existingRow) {
      this.incrementQuantity(existingRow.id);
      return;
    }

    const newRow: CartRow = {
      id: this.nextCartId++,
      productName: product.materialName,
      unitCost: Number(product.cost) || 0,
      quantity: 1
    };
    this.cart = [...this.cart, newRow];
    this.snackBar.open(`${product.materialName} added to the ticket`, '', { duration: 1500 });
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

  trackByProduct(index: number, item: ProductItem): string {
    return item.materialName;
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
    const formValues = this.productFm.value;
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
    return this.round2(this.getCartTotal() - this.getTotalPayments());
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

  getPaidPercent(): number {
    const total = this.getCartTotal();
    if (total <= 0) return this.getTotalPayments() > 0 ? 100 : 0;
    return Math.min(100, Math.max(0, (this.getTotalPayments() / total) * 100));
  }

  updatePaymentSummary(): void {
    this.cdr.markForCheck();
  }

  // Wizard navigation
  canProceedToPayment(): boolean {
    return this.patientSelected && this.cart.length > 0;
  }

  canProceedToReview(): boolean {
    return Math.abs(this.getBalance()) <= BALANCE_EPSILON;
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      if (!this.patientSelected) {
        this.showErrorMessage('Select a patient before continuing');
        return;
      }
      if (this.cart.length === 0) {
        this.showErrorMessage('Add at least one product to the ticket before continuing');
        return;
      }
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      if (!this.canProceedToReview()) {
        const balance = this.getBalance();
        this.showErrorMessage(
          balance > 0
            ? 'Total Payments Value is Less Than the Total Cost!!'
            : 'Total Payments Value is More Than the Total Cost!!'
        );
        return;
      }
      this.currentStep = 3;
    }
    this.cdr.markForCheck();
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep = (this.currentStep - 1) as WizardStep;
      this.cdr.markForCheck();
    }
  }

  goToStep(step: WizardStep): void {
    if (step === this.currentStep) return;
    if (step < this.currentStep) {
      this.currentStep = step;
      this.cdr.markForCheck();
      return;
    }
    if (step === 2 && this.canProceedToPayment()) {
      this.currentStep = 2;
    } else if (step === 3 && this.canProceedToPayment() && this.canProceedToReview()) {
      this.currentStep = 3;
    }
    this.cdr.markForCheck();
  }

  private buildProductsPayload(): Array<{ productName: string; amount: number; price: number }> {
    return this.cart.map(row => ({
      productName: row.productName,
      amount: row.quantity,
      price: this.getLineTotal(row)
    }));
  }

  // Form submission
  submit(): void {
    if (this.productFm.invalid) {
      this.markFormGroupTouched(this.productFm);
      return;
    }

    if (this.cart.length === 0) {
      this.showErrorMessage('Add at least one product to the ticket before submitting');
      return;
    }

    if (!this.canProceedToReview()) {
      const balance = this.getBalance();
      this.showErrorMessage(
        balance > 0
          ? 'Total Payments Value is Less Than the Total Cost!!'
          : 'Total Payments Value is More Than the Total Cost!!'
      );
      return;
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();

    const formValues = this.productFm.value;
    const patientPhone = this.namesAndNumbers.extractPhoneNumberFromSearchResult(formValues.patientPhone);

    const userModel = {
      patientPhone,
      products: this.buildProductsPayload(),
      cash: Number(formValues.cash) || 0,
      vodafoneCash: Number(formValues.vodafoneCash) || 0,
      visa: Number(formValues.visa) || 0,
      credit: Number(formValues.credit) || 0,
      instaPay: Number(formValues.instaPay) || 0,
      debit: Number(formValues.debit) || 0,
      total: this.getCartTotal()
    };

    const subscription = this.productservice.addProuduct(userModel)
      .subscribe({
        next: (data: any) => {
          this.isSubmitting = false;
          this.showSuccessMessage(data?.message || 'Products Added Successfully!');
          this.closeDialog();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.cdr.markForCheck();
          this.showErrorMessage(err.error?.message || 'An error occurred');
        }
      });

    this.subscriptions.add(subscription);
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

  closeDialog(): void {
    this.dialogRef.close();
  }
}