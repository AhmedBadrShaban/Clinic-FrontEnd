import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
  HostListener,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { ReservationsService } from '../../services/reservations-services/reservations.service';
import { PatientInfo } from '../../models/patient-Info';
import { PatientPoints } from '../../models/patient-points';
import { AddNewPatientComponent } from '../add-new-patient/add-new-patient.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../services/patient-server/patient.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

interface PatientSearchItem {
  displayText: string;
  phoneNumber: string;
  name: string;
}

const PATIENTS_KEY = 'patientsNamesAndPhones';
const PATIENTS_TTL_MINUTES = 15;
const SEARCH_DEBOUNCE_TIME = 300; // ms
const MAX_AUTOCOMPLETE_ITEMS = 50;

@Component({
  selector: 'app-reservation',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
})
export class ReservationComponent implements OnInit, OnDestroy {
  // UI State
  isVisible = false;
  selectedTab: string = 'patientInfoTab';
  isLoading = false;
  searchValue = '';

  // Patient Data
  patientData: any;
  patientNumber: string | null = null;
  reservationID: string | null = null;

  // Search Data
  private allPatientsData: PatientSearchItem[] = [];
  filteredData: string[] = [];

  // Search optimization
  private searchSubject = new Subject<string>();
  private subscriptions = new Subscription();

  PatientInfo: PatientInfo = {
    name: '',
    id: -1,
    gender: '',
    primaryPhone: '',
    secondaryPhone: '',
    knowUsThrough: '',
    note: '',
    debit: 0,
    date: '',
    lastReservation: '',
  };

  userType: string | null;

  constructor(
    private reservationsService: ReservationsService,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private loggedIn: AuthService,
    private dialogRef: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.userType = loggedIn.userType;
    this.initializeSearchDebounce();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const rect = document.getElementById('animate')?.getBoundingClientRect();
    const newVisibility = rect ? (rect.top <= window.innerHeight && rect.bottom >= 0) : false;

    if (this.isVisible !== newVisibility) {
      this.isVisible = newVisibility;
      this.cdr.markForCheck();
    }
  }

  ngOnInit(): void {
    if (this.userType !== 'ROLE_DOCTOR') {
      this.initializePatientData();
      this.subscribeToUpdates();
    } else {
      this.initializeDoctorView();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeSearchDebounce(): void {
    const searchSubscription = this.searchSubject
      .pipe(
        debounceTime(SEARCH_DEBOUNCE_TIME),
        distinctUntilChanged()
      )
      .subscribe((searchTerm: string) => {
        this.performSearch(searchTerm);
      });

    this.subscriptions.add(searchSubscription);
  }

  private initializePatientData(): void {
    const cachedData = this.getCachedPatientData();
    if (cachedData &&cachedData?.length>0) {
      this.allPatientsData = cachedData;
      this.updateFilteredData('');
      this.cdr.markForCheck();
    } else {
      this.loadPatientDataFromAPI();
    }
  }

  private getCachedPatientData(): PatientSearchItem[] | null {
    try {
      const cached = sessionStorage.getItem(PATIENTS_KEY);
      const cachedTime = sessionStorage.getItem(PATIENTS_KEY + '_timestamp');

      if (!cached || !cachedTime) return null;

      const now = new Date().getTime();
      const cacheAge = now - parseInt(cachedTime);
      const isCacheValid = cacheAge < PATIENTS_TTL_MINUTES * 60 * 1000;

      if (!isCacheValid) {
        this.clearCache();
        return null;
      }

      const rawData = JSON.parse(cached);
      return this.transformPatientData(rawData);
    } catch (error) {
      console.warn('Error reading cached data:', error);
      this.clearCache();
      return null;
    }
  }

  private loadPatientDataFromAPI(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    const subscription = this.reservationsService.getPatientsNamesAndPhones()
      .subscribe({
        next: (data: any) => {
          this.allPatientsData = this.transformPatientData(data);
          this.cachePatientData(data);
          this.updateFilteredData('');
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading patient data:', error);
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });

    this.subscriptions.add(subscription);
  }

  private transformPatientData(rawData: any[]): PatientSearchItem[] {
    if (!Array.isArray(rawData)) return [];

    return rawData.map(item => {
      // Assuming the API returns strings like "Name - PhoneNumber"
      if (typeof item === 'string') {
        const parts = item.split(' - ');
        return {
          displayText: item,
          name: parts[0] || '',
          phoneNumber: parts[1] || ''
        };
      }

      // Handle object format
      return {
        displayText: `${item.name} - ${item.phoneNumber}`,
        name: item.name || '',
        phoneNumber: item.phoneNumber || ''
      };
    });
  }

  private cachePatientData(data: any[]): void {
    try {
      sessionStorage.setItem(PATIENTS_KEY, JSON.stringify(data));
      sessionStorage.setItem(PATIENTS_KEY + '_timestamp', new Date().getTime().toString());
    } catch (error) {
      console.warn('Error caching patient data:', error);
    }
  }

  private clearCache(): void {
    sessionStorage.removeItem(PATIENTS_KEY);
    sessionStorage.removeItem(PATIENTS_KEY + '_timestamp');
  }

  private subscribeToUpdates(): void {
    const updateSubscription = this.reservationsService.update$
      .subscribe((data: any) => {
        if (Array.isArray(data)) {
          this.allPatientsData = this.transformPatientData(data);
          this.cachePatientData(data);
          this.updateFilteredData(this.searchValue);
          this.cdr.markForCheck();
        }
      });

    this.subscriptions.add(updateSubscription);
  }

  private initializeDoctorView(): void {
    const paramsSubscription = this.route.params.subscribe(() => {
      this.route.queryParams.subscribe((params) => {
        this.patientNumber = params['phoneNumber'] || null;
        this.reservationID = params['id'] || null;
        this.cdr.markForCheck();
      });
    });

    this.subscriptions.add(paramsSubscription);
  }

  // Public methods for template
  onSearchValueChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target?.value || '';
    console.log('value ', value )
    this.searchValue = value;
    this.searchSubject.next(value);
  }


  private performSearch(searchTerm: string): void {
    this.updateFilteredData(searchTerm);
    this.cdr.markForCheck();
  }

  private updateFilteredData(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredData = this.allPatientsData
        .slice(0, MAX_AUTOCOMPLETE_ITEMS)
        .map(item => item.displayText);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = this.allPatientsData
      .filter(item =>
        item.name.toLowerCase().includes(lowerSearchTerm) ||
        item.phoneNumber.includes(searchTerm)
      )
      .slice(0, MAX_AUTOCOMPLETE_ITEMS)
      .map(item => item.displayText);

    this.filteredData = filtered;
  }

  searchPatient(): void {
    const phoneNumber = this.extractPhoneNumberFromSearchResult(this.searchValue);

    if (!phoneNumber) {
      console.warn('No valid phone number found in search value');
      return;
    }

    this.patientNumber = phoneNumber;
    this.reservationsService.updatePhoneNumber(phoneNumber);

    const searchSubscription = this.patientService.searchPatients(phoneNumber)
      .subscribe({
        next: (data: any) => {
          this.PatientInfo = data;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error searching patient:', error);
        }
      });

    this.subscriptions.add(searchSubscription);
  }

  private extractPhoneNumberFromSearchResult(selectedRecord: string): string | null {
    console.log('selectedRecord', selectedRecord)
    if (!selectedRecord) return null;

    // Handle format "Name - PhoneNumber"
    const parts = selectedRecord.split(' - ');
    if (parts.length === 2) {
      return parts[1].trim();
    }

    // Handle direct phone number input
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (phoneRegex.test(selectedRecord.trim())) {
      return selectedRecord.trim();
    }

    return null;
  }

  openDialog(): void {
    const dialogRef = this.dialogRef.open(AddNewPatientComponent, {
      width: '600px',
      disableClose: true
    });

    const dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh patient data after adding new patient
        this.clearCache();
        this.loadPatientDataFromAPI();
      }
    });

    this.subscriptions.add(dialogSubscription);
  }

  onTabSelectChange(selectedIndex: number): void {
    if (this.userType === 'ROLE_RECEPTIONIST') {
      const tabs = ['patientInfoTab', 'historyTab', 'packagesTab', 'pointsTab', 'reservationsTab', 'paymentHistoryTab'];
      this.selectedTab = tabs[selectedIndex] || 'patientInfoTab';
    } else if (this.userType === 'ROLE_ADMIN') {
      // Handle admin tabs
      if (selectedIndex === 0) {
        this.selectedTab = 'idlePatientsTab';
      } else {
        const tabs = ['patientInfoTab', 'historyTab', 'packagesTab', 'pointsTab', 'reservationsTab', 'paymentHistoryTab'];
        this.selectedTab = tabs[selectedIndex - 1] || 'patientInfoTab';
      }
    } else if (this.userType === 'ROLE_DOCTOR') {
      this.selectedTab = 'afterWorkTab';
    }

    this.cdr.markForCheck();
  }
  // Template helper methods
  trackByFn(index: number, item: string): string {
    return item;
  }
  highlightSearchTerm(text: string, searchTerm: string): string {
    if (!searchTerm || !text) return text;

    const regex = new RegExp(`(${this.escapeRegExp(searchTerm)})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }
 
  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
   get hasPatientData(): boolean {
    return this.allPatientsData.length > 0;
  }

  get showSearchSection(): boolean {
    return this.userType !== 'ROLE_DOCTOR';
  }

  get canAddNewPatient(): boolean {
    return this.userType === 'ROLE_ADMIN';
  }
}