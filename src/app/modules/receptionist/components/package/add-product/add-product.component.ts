import { 
  Component, 
  ViewEncapsulation, 
  Inject, 
  OnInit, 
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy 
} from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

import { MaterialsService } from 'src/app/modules/admin/services/materials/materials.service';
import { PatientService } from 'src/app/modules/receptionist/services/patient-server/patient.service';
import { ReservationsService } from '../../../services/reservations-services/reservations.service';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface PatientSearchItem {
  displayText: string;
  phoneNumber: string;
  name: string;
}

const SEARCH_DEBOUNCE_TIME = 300;
const MAX_AUTOCOMPLETE_ITEMS = 50;

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, NgIf, MatProgressSpinnerModule, NgFor, MatOptionModule, MatDividerModule, MatSelectModule, CurrencyPipe]
})
export class AddProductComponent implements OnInit, OnDestroy {
  addProductFm: FormGroup;
  
  // Patient search properties
  patientSearchValue = '';
  isPatientLoading = false;
  allPatientsData: PatientSearchItem[] = [];
  filteredPatients: string[] = [];
  
  // Products
  AllProducts: any[] = [];
  
  // Form state
  isSubmitting = false;
  
  // Search subjects for debouncing
  private patientSearchSubject = new Subject<string>();
  private subscriptions = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<AddProductComponent>,
    private fb: FormBuilder,
    private namesAndNumbers: ReservationsService,
    private patientservice: PatientService,
    private productservice: MaterialsService,
    private cdr: ChangeDetectorRef
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
  }

  private initializeForm(): void {
    this.addProductFm = this.fb.group({
      patientPhone: ['', [Validators.required]],
      cash: [null],
      visa: [null],
      vodafoneCash: [null],
      instaPay: [null],
      credit: [null],
      total: [null],
      products: this.fb.array([this.createProductFormGroup()]),
    });
  }

  private initializeSearchDebouncing(): void {
    // Patient search debouncing
    const patientSearchSubscription = this.patientSearchSubject
      .pipe(debounceTime(SEARCH_DEBOUNCE_TIME), distinctUntilChanged())
      .subscribe((searchTerm: string) => {
        this.performPatientSearch(searchTerm);
      });

    this.subscriptions.add(patientSearchSubscription);
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
    const subscription = this.productservice.getAllMaterials()
      .subscribe({
        next: (data: any) => {
          this.AllProducts = data;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading products:', error);
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
    this.addProductFm.patchValue({ patientPhone: selectedValue });
  }

  // Utility methods
  extractPatientName(patient: string): string {
    const parts = patient.split(' - ');
    return parts[0]?.trim() || patient;
  }

  extractPatientPhone(patient: string): string {
    const parts = patient.split(' - ');
    return parts[1]?.trim() || '';
  }

  // Track by functions for performance
  trackByPatient(index: number, item: string): string {
    return item;
  }

  // Product methods
  get Products(): FormArray {
    return this.addProductFm.get('products') as FormArray;
  }

  addProduct(): void {
    this.Products.push(this.createProductFormGroup());
    this.cdr.markForCheck();
  }

  removeProduct(index: number): void {
    if (this.Products.length > 1) {
      this.Products.removeAt(index);
      this.updateTotal();
      this.cdr.markForCheck();
    }
  }

  createProductFormGroup(): FormGroup {
    return this.fb.group({
      productName: ['', Validators.required],
      amount: [1, [Validators.required, Validators.min(1)]],
      price: [null, Validators.required],
    });
  }

  updatePrice(index: number): void {
    const productNameControl = this.Products.at(index).get('productName');
    const amountControl = this.Products.at(index).get('amount');
    const priceControl = this.Products.at(index).get('price');

    if (productNameControl && amountControl && priceControl) {
      const selectedProduct = productNameControl.value;
      const product = this.AllProducts.find(p => p.materialName === selectedProduct);

      if (product) {
        const amount = amountControl.value || 0;
        const cost = product.cost || 0;

        // Calculate and update the price field
        priceControl.setValue(amount * cost);
      }
    }
    this.updateTotal();
  }

  updateTotal(): void {
    const totalControl = this.addProductFm.get('total');
    if (totalControl) {
      const total = this.Products.controls.reduce((acc, control) => {
        const price = control.get('price')?.value ?? 0;
        return acc + price;
      }, 0);

      // Update the total field
      totalControl.setValue(total);
      this.cdr.markForCheck();
    }
  }

  // Payment calculation methods
  getTotalPayments(): number {
    const formValues = this.addProductFm.value;
    return (formValues.cash || 0) + 
           (formValues.vodafoneCash || 0) + 
           (formValues.visa || 0) + 
           (formValues.credit || 0) + 
           (formValues.instaPay || 0);
  }

  getBalance(): number {
    const total = this.addProductFm.get('total')?.value || 0;
    const payments = this.getTotalPayments();
    return total - payments;
  }

  getBalanceClass(): string {
    const balance = this.getBalance();
    if (balance > 0) return 'text-danger'; // Underpaid
    if (balance < 0) return 'text-warning'; // Overpaid
    return 'text-success'; // Exact payment
  }

  // Form submission
  submit(): void {
    if (this.addProductFm.invalid) {
      this.markFormGroupTouched(this.addProductFm);
      return;
    }

    const userModel = this.addProductFm.value;
    const totalPayments = this.getTotalPayments();
    const totalCost = userModel.total || 0;

    // Validation
    if (totalCost > totalPayments) {
      this.showErrorMessage("Total Payments Value is Less Than the Total Cost!!");
      return;
    } else if (totalCost < totalPayments) {
      this.showErrorMessage("Total Payments Value is More Than the Total Cost!!");
      return;
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();

    // Extract phone number from search result
    userModel.patientPhone = this.namesAndNumbers.extractPhoneNumberFromSearchResult(userModel.patientPhone);

    const subscription = this.productservice.addProuduct(userModel)
      .subscribe({
        next: (data: any) => {
          this.isSubmitting = false;
          this.showSuccessMessage(data.message);
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

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(c => {
          if (c instanceof FormGroup) {
            this.markFormGroupTouched(c);
          } else {
            c.markAsTouched();
          }
        });
      }
    });
  }

  private showSuccessMessage(message: string): void {
    // Replace with MatSnackBar for better UX
    alert(message);
  }

  private showErrorMessage(message: string): void {
    // Replace with MatSnackBar for better UX
    alert(message);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}