import { Component, Input, OnInit, OnDestroy, TemplateRef, ViewChild, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { patientPackages } from 'src/app/modules/receptionist/models/patient-packages';
import { ReservationsService } from '../../../services/reservations-services/reservations.service';
import { MatDialog } from '@angular/material/dialog';
import { PackageDetailsComponent } from './package-details/package-details.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;
  @Input() phoneNumber: string | null = null;
  @Input() isActive = false; // NEW: tab active state

  private sub = new Subscription();
  private initialized = false; // NEW: ensure we only load once

  tableColumns: Array<{ key: string, label: string, template?: TemplateRef<any> }> = [];
  dataSource = new MatTableDataSource<patientPackages>();
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 0; // Material paginator is 0-based
  pageSizeOptions: number[] = [5, 10, 25, 50];
  loadingState = false;

  constructor(
    private reservationservice: ReservationsService,
    private dialogRef: MatDialog,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.tableColumns = [
      { key: 'packageName', label: 'Package' },
      { key: 'clinicName', label: 'Clinic' },
      { key: 'date', label: 'Purchase Date' },
      { key: 'action', label: 'Action', template: this.actionTemplate }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Load once when tab becomes active
    if (changes['isActive'] && this.isActive && !this.initialized && this.phoneNumber) {
      this.initialized = true;
      this.getPatientPackages(this.currentPage);
    }

    // If phoneNumber changes while active
    if (changes['phoneNumber'] && this.isActive && this.phoneNumber) {
      this.getPatientPackages(this.currentPage);
    }
  }

  getPatientPackages(page: number): void {
    if (!this.phoneNumber) return;

    this.loadingState = true;
    this.reservationservice.getPackages(this.phoneNumber, page, this.pageSize)
      .subscribe({
        next: (data) => {
          this.dataSource.data = [...data.data];
          this.totalItems = data.totalItems;
          this.loadingState = false;
          this.cd.detectChanges();

        },
        error: () => {
          this.loadingState = false;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPatientPackages(this.currentPage);
  }

  openDialog(reservedId: string): void {
    this.dialogRef.open(PackageDetailsComponent, { data: reservedId });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
