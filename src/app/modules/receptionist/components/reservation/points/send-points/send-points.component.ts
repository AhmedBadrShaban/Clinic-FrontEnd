// send-points.component.ts
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { PatientService } from 'src/app/modules/receptionist/services/patient-server/patient.service';
import { ReservationsService } from 'src/app/modules/receptionist/services/reservations-services/reservations.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, NgFor } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface PatientSearchItem {
  displayText: string;
  name: string;
  phoneNumber: string;
}

const SEARCH_DEBOUNCE_TIME = 300;
const MAX_AUTOCOMPLETE_ITEMS = 50;

@Component({
    selector: 'app-send-points',
    templateUrl: './send-points.component.html',
    styleUrls: ['./send-points.component.css'],
    standalone: true,
    imports: [MatIconModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, NgIf, MatProgressSpinnerModule, NgFor, MatOptionModule]
})
export class SendPointsComponent implements OnInit, OnDestroy {

  formData = {
    senderPhone: '',
    receiverPhone: '',
    theAmount: null as number | null
  };

  // Autocomplete state — same pattern as reservation search
  searchValue = '';
  isSearching = false;
  filteredPatients: string[] = [];
  private allPatientsData: PatientSearchItem[] = [];
  private searchSubject = new Subject<string>();

  isSubmitting = false;
  private subscriptions = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private dialogRef: MatDialogRef<SendPointsComponent>,
    private patientService: PatientService,
    private reservationsService: ReservationsService,
    private snackBar: MatSnackBar
  ) {
    this.formData.senderPhone = data;
  }

  ngOnInit(): void {
    this.initSearchDebounce();
    this.loadInitialPatients();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.searchSubject.complete();
  }

  // ── Search setup ──────────────────────────────────────────

  private initSearchDebounce(): void {
    const sub = this.searchSubject
      .pipe(debounceTime(SEARCH_DEBOUNCE_TIME), distinctUntilChanged())
      .subscribe(term => this.performSearch(term));
    this.subscriptions.add(sub);
  }

  private loadInitialPatients(): void {
    this.isSearching = true;
    const sub = this.reservationsService.getPatientsNamesAndPhonesAuto(0)
      .subscribe({
        next: (data: any) => {
          this.allPatientsData = this.transformPatientData(data);
          this.filteredPatients = this.allPatientsData
            .slice(0, MAX_AUTOCOMPLETE_ITEMS)
            .map(p => p.displayText);
          this.isSearching = false;
        },
        error: () => { this.isSearching = false; }
      });
    this.subscriptions.add(sub);
  }

  private performSearch(term: string): void {
    if (!term.trim()) {
      this.filteredPatients = this.allPatientsData
        .slice(0, MAX_AUTOCOMPLETE_ITEMS)
        .map(p => p.displayText);
      return;
    }

    this.isSearching = true;
    const sub = this.reservationsService.getPatientsNamesAndPhonesAuto(term)
      .subscribe({
        next: (data: any) => {
          this.allPatientsData = this.transformPatientData(data);
          const lower = term.toLowerCase();
          this.filteredPatients = this.allPatientsData
            .filter(p =>
              p.name.toLowerCase().includes(lower) ||
              p.phoneNumber.includes(term)
            )
            .slice(0, MAX_AUTOCOMPLETE_ITEMS)
            .map(p => p.displayText);
          this.isSearching = false;
        },
        error: () => { this.isSearching = false; }
      });
    this.subscriptions.add(sub);
  }

  private transformPatientData(raw: any[]): PatientSearchItem[] {
    if (!Array.isArray(raw)) return [];
    return raw.map(item => {
      if (typeof item === 'string') {
        const parts = item.split(' - ');
        return { displayText: item, name: parts[0]?.trim() || '', phoneNumber: parts[1]?.trim() || '' };
      }
      return {
        displayText: `${item.name} - ${item.phoneNumber}`,
        name: item.name || '',
        phoneNumber: item.phoneNumber || ''
      };
    });
  }

  onSearchInput(event: any): void {
    this.searchSubject.next(event.target.value);
  }

  onPatientSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as string;
    this.searchValue = selected;
    // Extract phone number from "Name - Phone" format
    const parts = selected.split(/\s*-\s*/);
    this.formData.receiverPhone = parts.length > 1
      ? parts[parts.length - 1].trim()
      : selected.trim();
  }

  extractName(patient: string): string {
    const parts = patient.split(/\s*-\s*/);
    return parts.slice(0, -1).join('-').trim() || patient;
  }

  extractPhone(patient: string): string {
    const parts = patient.split(/\s*-\s*/);
    return parts.length > 1 ? parts[parts.length - 1].trim() : '';
  }

  trackByPatient(index: number, item: string): string {
    return item;
  }

  // ── Submit ────────────────────────────────────────────────

  submit(): void {
    if (!this.formData.receiverPhone) {
      this.showError('Please select a receiver patient.');
      return;
    }
    if (!this.formData.theAmount || this.formData.theAmount <= 0) {
      this.showError('Please enter a valid points amount.');
      return;
    }
    if (this.formData.receiverPhone === this.formData.senderPhone) {
      this.showError('Sender and receiver cannot be the same patient.');
      return;
    }

    this.isSubmitting = true;
    const sub = this.patientService.sendPoints(this.formData)
      .subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          this.showSuccess(res.message || 'Points sent successfully!');
          // FIX: close with true so parent refreshes via afterClosed()
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.showError(err.error?.message || 'Failed to send points.');
        }
      });
    this.subscriptions.add(sub);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  private showSuccess(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 4000, panelClass: ['success-snackbar'] });
  }

  private showError(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
  }
}