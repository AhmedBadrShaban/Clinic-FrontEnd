// doctor-reservation.component.ts
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    <div class="dr-container">

      <!-- Patient Header -->
      <div class="patient-header" *ngIf="patientName">
        <div class="patient-avatar">
          <mat-icon>person</mat-icon>
        </div>
        <div class="patient-info">
          <h2 class="patient-name">{{ patientName }}</h2>
          <div class="meta-row">
            <span class="meta-badge">
              <mat-icon class="meta-icon">tag</mat-icon> {{ reservationID }}
            </span>
            <span class="meta-badge" *ngIf="doctorName">
              <mat-icon class="meta-icon">medical_services</mat-icon> {{ doctorName }}
            </span>
            <span class="meta-badge" *ngIf="reservationDate">
              <mat-icon class="meta-icon">calendar_today</mat-icon> {{ reservationDate }}
            </span>
          </div>
          <div class="services-row" *ngIf="services.length">
            <span *ngFor="let s of services" class="service-pill">{{ s }}</span>
          </div>
          <div class="note-row" *ngIf="note">
            <mat-icon class="note-icon">notes</mat-icon>
            <span class="note-text">{{ note }}</span>
          </div>
        </div>
        <div class="status-chip">Active</div>
      </div>

      <!-- State lost on page refresh -->
      <div *ngIf="stateLost" class="state-lost-banner">
        <mat-icon>info_outline</mat-icon>
        <span>Patient session expired. Please go back and reselect the patient.</span>
        <button mat-button class="go-back-btn" (click)="goBack()">Go Back</button>
      </div>

      <!-- Tabs -->
      <div class="tabs-wrapper" *ngIf="patientNumber && !stateLost">
        <mat-tab-group
          [(selectedIndex)]="selectedTabIndex"
          (selectedIndexChange)="onTabSelectChange($event)"
          class="dr-tabs"
          animationDuration="200ms">

          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">history</mat-icon> History
            </ng-template>
            <div class="tab-panel">
              <app-history
                *ngIf="isTabActive('historyTab')"
                [phoneNumber]="patientNumber"
                [isActive]="isTabActive('historyTab')">
              </app-history>
            </div>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">assignment</mat-icon> After Work
            </ng-template>
            <div class="tab-panel">
              <app-after-work
                *ngIf="isTabActive('afterWorkTab')"
                [phoneNumber]="patientNumber"
                [id]="reservationID"
                [isLaser]="isLaser"
                [isActive]="isTabActive('afterWorkTab')">
              </app-after-work>
            </div>
          </mat-tab>

        </mat-tab-group>
      </div>

    </div>
  `,
  styles: [`
 
    :host {
      display: block;
      min-height: 100vh;
      background: #f5f0ff;
      font-family: 'Nunito', sans-serif;
    }

    .dr-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 32px 24px 60px;
    }

    /* ─── Patient Header ─── */
    .patient-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      background: #ffffff;
      border: 2px solid #6F2DBD;
      border-radius: 20px;
      padding: 20px 24px;
      margin-bottom: 24px;
      animation: slideDown 0.3s ease both;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .patient-avatar {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, #6F2DBD, #A379D5);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .patient-avatar mat-icon {
      color: #ffffff;
      font-size: 26px;
      width: 26px;
      height: 26px;
    }

    .patient-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .patient-name {
      font-size: 22px;
      font-weight: 800;
      color: #3b1e6e;
      margin: 0;
    }

    .meta-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }

    .meta-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #7c5ab8;
      background: #f0e8ff;
      border: 1px solid #d4bef5;
      border-radius: 8px;
      padding: 3px 10px;
      font-weight: 600;
    }

    .meta-icon {
      font-size: 13px;
      width: 13px;
      height: 13px;
    }

    .services-row {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
    }

    .service-pill {
      background-color: #A379D5;
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      border-radius: 20px;
      padding: 3px 12px;
      border: 1px solid rgba(0,0,0,0.08);
    }

    .note-row {
      display: flex;
      align-items: flex-start;
      gap: 5px;
    }

    .note-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      color: #9e84c4;
      margin-top: 1px;
      flex-shrink: 0;
    }

    .note-text {
      font-size: 13px;
      color: #9e84c4;
      font-style: italic;
      line-height: 1.5;
    }

    .status-chip {
      flex-shrink: 0;
      font-size: 12px;
      font-weight: 700;
      color: #6F2DBD;
      background: #ede0ff;
      border: 1px solid #c4aee8;
      border-radius: 20px;
      padding: 4px 14px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }

    /* ─── State Lost Banner ─── */
    .state-lost-banner {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #fff8ec;
      border: 1px solid #f5c842;
      border-radius: 14px;
      padding: 14px 18px;
      color: #a07010;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 24px;
    }

    .state-lost-banner mat-icon { flex-shrink: 0; }
    .state-lost-banner span     { flex: 1; }

    .go-back-btn {
      color: #6F2DBD !important;
      border: 1px solid #6F2DBD !important;
      border-radius: 8px !important;
      font-weight: 700 !important;
      flex-shrink: 0;
    }

    /* ─── Tabs ─── */
    .tabs-wrapper {
      background: #ffffff;
      border: 2px solid #6F2DBD;
      border-radius: 20px;
      overflow: hidden;
      animation: fadeIn 0.3s ease 0.1s both;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .dr-tabs { background: transparent; }

    ::ng-deep .dr-tabs .mat-mdc-tab-header {
      background: #f5f0ff;
      border-bottom: 2px solid #e0d0f8;
      padding: 0 16px;
    }

    ::ng-deep .dr-tabs .mat-mdc-tab {
      color: #9e84c4 !important;
      font-family: 'Nunito', sans-serif;
      font-size: 15px;
      font-weight: 700;
      opacity: 1 !important;
      min-width: 130px;
    }

    ::ng-deep .dr-tabs .mat-mdc-tab.mdc-tab--active {
      color: #6F2DBD !important;
    }

    ::ng-deep .dr-tabs .mdc-tab-indicator__content--underline {
      border-color: #6F2DBD !important;
      border-width: 3px !important;
    }

    ::ng-deep .dr-tabs .mat-mdc-tab-body-wrapper {
      background: #ffffff;
    }

    .tab-icon {
      font-size: 17px;
      width: 17px;
      height: 17px;
      margin-right: 6px;
      vertical-align: middle;
    }

    .tab-panel {
      padding: 24px;
      min-height: 400px;
    }

    /* ─── Responsive ─── */
    @media (max-width: 600px) {
      .dr-container   { padding: 16px 12px 40px; }
      .patient-name   { font-size: 18px; }
      .patient-header { flex-wrap: wrap; padding: 14px 16px; }
      .tab-panel      { padding: 16px; }
    }
  `]
})
export class DoctorReservationComponent implements OnInit, OnDestroy {
  selectedTabIndex = 0;

  patientNumber: string | null = null;
  patientName: string | null = null;
  doctorName: string | null = null;
  reservationID: string | null = null;
  reservationDate: string | null = null;
  services: string[] = [];
  note: string | null = null;
  isLaser: boolean = false;
  stateLost = false;

  tabDataStates: { [key: string]: TabDataState } = {
    historyTab: { loading: false, loaded: false, error: null, initialized: false },
    afterWorkTab: { loading: false, loaded: false, error: null, initialized: false }
  };

  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
    // ─── KEY FIX ───
    // router.getCurrentNavigation() is null in ngOnInit because navigation
    // is already complete by then. Read from window.history.state instead.
    const historyState = window.history.state;
    // console.log('[DoctorReservation] window.history.state:', historyState);

    const reservation = historyState?.reservation;
    // console.log('[DoctorReservation] reservation from state:', reservation);

    if (reservation && reservation.patientPhone) {
      // console.log('[DoctorReservation] ✅ State found — loading patient:', reservation.patientName);
      this.applyReservation(reservation);
      return;
    }

    // State lost (page refresh or direct URL)
    console.warn('[DoctorReservation] ⚠️ No reservation in history state. Possible reasons:');
    console.warn('  1. Page was refreshed (state cleared by browser)');
    console.warn('  2. User navigated directly via URL');
    console.warn('  3. router.navigate() state was not set correctly');
    console.warn('  4. historyState keys:', historyState ? Object.keys(historyState) : 'null/undefined');

    const paramsSubscription = this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.reservationID = params['id'];
        console.warn('[DoctorReservation] Only ID in URL:', this.reservationID, '— showing state lost message');
        this.stateLost = true;
        this.cdr.markForCheck();
      }
    });

    this.subscriptions.add(paramsSubscription);
  }

  private applyReservation(reservation: any): void {
    // console.log('reservation :>> ', reservation);
    this.patientNumber = reservation.patientPhone;
    this.patientName = reservation.patientName;
    this.doctorName = reservation.doctorName;
    this.reservationID = reservation.reservationId;
    this.reservationDate = reservation.reservedAt;
    this.services = reservation.service || [];
    this.note = reservation.note || null;
    this.isLaser = reservation.laser || false;
    this.stateLost = false;

    // console.log('[DoctorReservation] Applied reservation. patientNumber:', this.patientNumber);

    this.reservationsService.updatePhoneNumber(this.patientNumber!);
    this.resetTabStates();
    this.cdr.markForCheck();
  }

  private resetTabStates(): void {
    Object.keys(this.tabDataStates).forEach(key => {
      this.tabDataStates[key] = { loading: false, loaded: false, error: null, initialized: false };
    });
  }

  goBack(): void {
    this.router.navigate(['doctor']);
  }

  onTabSelectChange(selectedIndex: number): void {
    this.selectedTabIndex = selectedIndex;
    this.tabDataStates[this.getCurrentTabName(selectedIndex)].initialized = true;
    this.cdr.markForCheck();
  }

  getCurrentTabName(index: number): string {
    return ['historyTab', 'afterWorkTab'][index] || 'historyTab';
  }

  isTabActive(tabName: string): boolean {
    return this.getCurrentTabName(this.selectedTabIndex) === tabName;
  }
}