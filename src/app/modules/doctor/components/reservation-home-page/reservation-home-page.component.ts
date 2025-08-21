// doctor-reservation.component.ts
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReservationsService } from 'src/app/modules/receptionist/services/reservations-services/reservations.service';

interface TabDataState {
  loading: boolean;
  loaded: boolean;
  error: string | null;
  initialized: boolean;
}

@Component({
  selector: 'app-doctor-reservation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="doctor-reservation-container">
      <div class="patient-header" *ngIf="patientNumber">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Patient: {{ patientNumber }}</h5>
            <small class="text-muted" *ngIf="reservationID">Reservation ID: {{ reservationID }}</small>
          </div>
        </div>
      </div>

      <div class="tabs-container">
        <mat-tab-group [(selectedIndex)]="selectedTabIndex" 
                       (selectedIndexChange)="onTabSelectChange($event)"
                       class="doctor-tabs" 
                       mat-align-tabs="center" 
                       backgroundColor="accent" 
                       color="primary">

          <!-- History Tab -->
          <mat-tab label="History">
            <div class="tab-content-wrapper">
              <app-history *ngIf="isTabActive('historyTab') && hasSelectedPatient" 
                          [phoneNumber]="patientNumber"
                          [isActive]="isTabActive('historyTab')">
              </app-history>

              <div *ngIf="tabDataStates['historyTab'].loading" class="text-center p-4">
                <mat-spinner diameter="40"></mat-spinner>
                <p class="mt-2">Loading history...</p>
              </div>

              <div *ngIf="!hasSelectedPatient" class="text-center p-4 text-muted">
                <mat-icon>history</mat-icon>
                <p>No patient selected</p>
              </div>
            </div>
          </mat-tab>

          <!-- After Work Tab -->
          <mat-tab label="After Work">
            <div class="tab-content-wrapper">
              <app-after-work *ngIf="isTabActive('afterWorkTab') && hasSelectedPatient" 
                             [phoneNumber]="patientNumber"
                             [id]="reservationID" 
                             [isActive]="isTabActive('afterWorkTab')">
              </app-after-work>

              <div *ngIf="tabDataStates['afterWorkTab'].loading" class="text-center p-4">
                <mat-spinner diameter="40"></mat-spinner>
                <p class="mt-2">Loading treatment notes...</p>
              </div>

              <div *ngIf="!hasSelectedPatient" class="text-center p-4 text-muted">
                <mat-icon>assignment</mat-icon>
                <p>No patient selected</p>
              </div>
            </div>
          </mat-tab>

        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .doctor-reservation-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .patient-header {
      margin-bottom: 20px;
    }

    .patient-header .card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .tabs-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .tab-content-wrapper {
      padding: 20px;
      min-height: 400px;
    }

    .doctor-tabs {
      background: white;
    }

    .text-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 200px;
    }

    .text-center mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      opacity: 0.5;
      margin-bottom: 10px;
    }

    .text-muted {
      opacity: 0.6;
    }
  `]
})
export class DoctorReservationComponent implements OnInit, OnDestroy {
  selectedTabIndex = 0;
  patientNumber: string | null = null;
  reservationID: string | null = null;

  tabDataStates: { [key: string]: TabDataState } = {
    historyTab: { loading: false, loaded: false, error: null, initialized: false },
    afterWorkTab: { loading: false, loaded: false, error: null, initialized: false }
  };

  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private reservationsService: ReservationsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeDoctorView();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeDoctorView(): void {
    const paramsSubscription = this.route.queryParams.subscribe((params) => {
    //console.log('Doctor reservation - Query params received:', params);

      const phoneNumber = params['phoneNumber'] || params['phone'];
      const reservationID = params['id'];

    //console.log('Phone number:', phoneNumber);
    //console.log('Reservation ID:', reservationID);

      if (phoneNumber && phoneNumber !== this.patientNumber) {
        this.patientNumber = phoneNumber;
        this.reservationID = reservationID;
        this.selectedTabIndex = 0; // Start with History tab
        this.resetTabStates();

        // Update the service with the phone number
        this.reservationsService.updatePhoneNumber(this.patientNumber);

      //console.log('Doctor reservation initialized');
      //console.log('Selected tab index:', this.selectedTabIndex);
      //console.log('Current tab name:', this.getCurrentTabName(this.selectedTabIndex));
      //console.log('Has selected patient:', this.hasSelectedPatient);
      }

      this.cdr.markForCheck();
    });

    this.subscriptions.add(paramsSubscription);
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

  onTabSelectChange(selectedIndex: number): void {
    this.selectedTabIndex = selectedIndex;
    const currentTabName = this.getCurrentTabName(selectedIndex);
    this.tabDataStates[currentTabName].initialized = true;
    this.cdr.markForCheck();
  }

  getCurrentTabName(index: number): string {
    const doctorTabs = ['historyTab', 'afterWorkTab'];
    return doctorTabs[index] || 'historyTab';
  }

  isTabActive(tabName: string): boolean {
    const currentTabName = this.getCurrentTabName(this.selectedTabIndex);
    return currentTabName === tabName;
  }

  get hasSelectedPatient(): boolean {
    return !!this.patientNumber;
  }

  selectTab(index: number): void {
    this.selectedTabIndex = index;
  }

  selectTabByName(tabName: string): void {
    const doctorTabs = ['historyTab', 'afterWorkTab'];
    const index = doctorTabs.indexOf(tabName);
    if (index !== -1) {
      this.selectedTabIndex = index;
    }
  }
}