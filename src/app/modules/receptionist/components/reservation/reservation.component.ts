// reservation.component.ts (cleaned - no doctor logic)
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { ReservationsService } from '../../services/reservations-services/reservations.service';
import { PatientInfo } from '../../models/patient-Info';
import { AddNewPatientComponent } from '../add-new-patient/add-new-patient.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../services/patient-server/patient.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subject, Subscription, debounceTime, distinctUntilChanged, BehaviorSubject } from 'rxjs';

interface PatientSearchItem {
  displayText: string;
  phoneNumber: string;
  name: string;
}

interface TabDataState {
  loading: boolean;
  loaded: boolean;
  error: string | null;
  initialized: boolean;
}

const SEARCH_DEBOUNCE_TIME = 300;
const MAX_AUTOCOMPLETE_ITEMS = 50;

@Component({
  selector: 'app-reservation',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
})
export class ReservationComponent implements OnInit, OnDestroy {
  isVisible = false;
  isLoading = false;
  searchValue = '';
  selectedTabIndex = 0;
  totalPatients!: number;

  private currentPatientSubject = new BehaviorSubject<PatientInfo | null>(null);
  currentPatient$ = this.currentPatientSubject.asObservable();

  patientNumber: string | null = null;
  private allPatientsData: PatientSearchItem[] = [];
  filteredData: string[] = [];

  // Tab state tracking (removed doctor-specific tabs)
  tabDataStates: { [key: string]: TabDataState } = {
    patientInfoTab: { loading: false, loaded: false, error: null, initialized: false },
    historyTab: { loading: false, loaded: false, error: null, initialized: false },
    packagesTab: { loading: false, loaded: false, error: null, initialized: false },
    pointsTab: { loading: false, loaded: false, error: null, initialized: false },
    reservationsTab: { loading: false, loaded: false, error: null, initialized: false },
    paymentHistoryTab: { loading: false, loaded: false, error: null, initialized: false },
    idlePatientsTab: { loading: false, loaded: false, error: null, initialized: false }
  };

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
    private router: Router,
    private loggedIn: AuthService,
    private dialogRef: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.userType = loggedIn.userType;
    this.initializeSearchDebounce();
  }

  ngOnInit(): void {
  //console.log('Receptionist reservation component initialized');
    this.initializeComponent();

    // Handle route parameters for direct navigation
    const paramSubscription = this.route.paramMap.subscribe(params => {
      const phoneFromRoute = params.get('phone');
      if (phoneFromRoute) {
        this.patientNumber = phoneFromRoute;
        this.searchValue = phoneFromRoute;
        this.selectedTabIndex = 0;
        this.resetTabStates();
        this.reservationsService.updatePhoneNumber(this.patientNumber);
        this.loadPatientInfo(phoneFromRoute);
      }
    });

    this.subscriptions.add(paramSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.currentPatientSubject.complete();
  }

  private initializeComponent(): void {
  //console.log('Initializing receptionist/admin component');

    // Load total patients count for admin
    if (this.userType === 'ROLE_ADMIN') {
      this.reservationsService.getTotalPatients().subscribe(res => {
        this.totalPatients = res;
      //console.log('Total patients:', res);
      });
    }

    this.initializePatientData();
    this.setInitialTab();
  }

  private initializeSearchDebounce(): void {
    const searchSubscription = this.searchSubject
      .pipe(debounceTime(SEARCH_DEBOUNCE_TIME), distinctUntilChanged())
      .subscribe((searchTerm: string) => {
        this.performSearch(searchTerm);
      });

    this.subscriptions.add(searchSubscription);
  }

  private initializePatientData(): void {
    this.loadPatientDataFromAPI(this.searchSubject);
  }

  private loadPatientDataFromAPI(query: any): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    const subscription = this.reservationsService.getPatientsNamesAndPhonesAuto(query)
      .subscribe({
        next: (data: any) => {
          this.allPatientsData = this.transformPatientData(data);
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

  private setInitialTab(): void {
    this.selectedTabIndex = 0;
  }

  private resetTabStates(): void {
    Object.keys(this.tabDataStates).forEach(key => {
      this.tabDataStates[key] = {
        loading: false,
        loaded: false,
        error: null,
        initialized: false
      };
    });
  }

  onSearchValueChange(value: any): void {
    this.searchSubject.next(value);
  }

  onPatientSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.value as string;
    this.searchValue = selectedValue;
  //console.log('searchValue ', this.searchValue);
  }

  private performSearch(searchTerm: any): void {
    if (!searchTerm.trim()) {
      this.filteredData = [];
      this.cdr.markForCheck();
      return;
    }

    this.isLoading = true;
    const subscription = this.reservationsService.getPatientsNamesAndPhonesAuto(searchTerm)
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

          this.filteredData = filtered;
        //console.log('autocomplete', this.filteredData);

          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error during search:', error);
          this.filteredData = [];
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });

    this.subscriptions.add(subscription);
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

    this.selectedTabIndex = 0;

    if (!phoneNumber) {
      this.showMessage('No valid phone number found in search value', 'error');
      return;
    }

    this.isLoading = true;
    this.resetTabStates();
    this.patientNumber = phoneNumber;
    this.reservationsService.updatePhoneNumber(this.patientNumber);

    this.cdr.markForCheck();
    this.loadPatientInfo(phoneNumber);
  }

  private loadPatientInfo(phoneNumber: string): void {
  //console.log('Loading patient info for:', phoneNumber);
    this.setTabLoading('patientInfoTab', true);

    const searchSubscription = this.patientService.searchPatients(phoneNumber)
      .subscribe({
        next: (data: any) => {
          this.PatientInfo = data;
          this.currentPatientSubject.next(data);
          this.setTabLoaded('patientInfoTab', true);
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error searching patient:', error);
          this.setTabError('patientInfoTab', 'Failed to load patient information');
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });

    this.subscriptions.add(searchSubscription);
  }

  private extractPhoneNumberFromSearchResult(selectedRecord: string): string | null {
    if (!selectedRecord) return null;

    const parts = selectedRecord.split(/\s*-\s*/);
    if (parts.length === 2) {
      return parts[1].trim();
    }

    if (/^\d+$/.test(selectedRecord.trim())) {
      return selectedRecord.trim();
    }

    return null;
  }

  openDialog(): void {
    const dialogRef = this.dialogRef.open(AddNewPatientComponent, {
      width: '600px',
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });

    const dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPatientDataFromAPI(this.searchSubject);
        this.showMessage('Patient added successfully!', 'success');
      }
    });

    this.subscriptions.add(dialogSubscription);
  }

  onTabSelectChange(selectedIndex: number): void {
    this.selectedTabIndex = selectedIndex;
    const currentTabName = this.getCurrentTabName(selectedIndex);
    this.tabDataStates[currentTabName].initialized = true;
    this.cdr.markForCheck();
  }

  public getCurrentTabName(index: number): string {
    if (this.userType === 'ROLE_ADMIN') {
      const adminTabs = ['patientInfoTab', 'historyTab', 'packagesTab', 'pointsTab', 'reservationsTab', 'paymentHistoryTab', 'idlePatientsTab'];
      return adminTabs[index] || 'patientInfoTab';
    } else {
      // Receptionist tabs
      const receptionistTabs = ['patientInfoTab', 'historyTab', 'packagesTab', 'pointsTab', 'reservationsTab', 'paymentHistoryTab'];
      return receptionistTabs[index] || 'patientInfoTab';
    }
  }

  private setTabLoading(tabName: string, loading: boolean): void {
    this.tabDataStates[tabName].loading = loading;
    if (loading) {
      this.tabDataStates[tabName].error = null;
    }
  }

  private setTabLoaded(tabName: string, loaded: boolean): void {
    this.tabDataStates[tabName].loaded = loaded;
    this.tabDataStates[tabName].loading = false;
    this.tabDataStates[tabName].initialized = true;
  }

  private setTabError(tabName: string, error: string): void {
    this.tabDataStates[tabName].error = error;
    this.tabDataStates[tabName].loading = false;
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
  //console.log(`${type.toUpperCase()}: ${message}`);
  }

  trackByFn(index: number, item: string): string {
    return item;
  }

  selectTab(index: number): void {
    this.selectedTabIndex = index;
  }

  selectTabByName(tabName: string): void {
    const index = this.getTabIndexByName(tabName);
    if (index !== -1) {
      this.selectedTabIndex = index;
    }
  }

  private getTabIndexByName(tabName: string): number {
    if (this.userType === 'ROLE_ADMIN') {
      const adminTabs = ['patientInfoTab', 'historyTab', 'packagesTab', 'pointsTab', 'reservationsTab', 'paymentHistoryTab', 'idlePatientsTab'];
      return adminTabs.indexOf(tabName);
    } else {
      const receptionistTabs = ['patientInfoTab', 'historyTab', 'packagesTab', 'pointsTab', 'reservationsTab', 'paymentHistoryTab'];
      return receptionistTabs.indexOf(tabName);
    }
  }

  isTabActive(tabName: string): boolean {
    const currentTabName = this.getCurrentTabName(this.selectedTabIndex);
    return currentTabName === tabName;
  }

  get hasPatientData(): boolean {
    return this.allPatientsData.length > 0;
  }

  get canAddNewPatient(): boolean {
    return this.userType === 'ROLE_ADMIN';
  }

  get hasSelectedPatient(): boolean {
    return !!this.patientNumber;
  }
}