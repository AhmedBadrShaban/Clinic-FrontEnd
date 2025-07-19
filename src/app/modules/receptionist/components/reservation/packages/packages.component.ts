// packages.component.ts
import { Component, Input, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
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
export class PackagesComponent implements OnInit, OnDestroy {
  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;
  @Input() phoneNumber: any;

  private sub = new Subscription();
  tableColumns: Array<{ key: string, label: string, template?: TemplateRef<any> }> = [];
  dataSource = new MatTableDataSource<patientPackages>();
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 0; // Changed to 0-based indexing to match Material table
  pageSizeOptions: number[] = [5, 10, 25, 50];

  constructor(
    private reservationservice: ReservationsService,
    private dialogRef: MatDialog
  ) { }

  ngOnInit(): void {
    // Define table columns including the action column with template
    this.tableColumns = [
      { key: 'packageName', label: 'Package' },
      { key: 'clinicName', label: 'Clinic' },
      { key: 'date', label: 'Purchase Date' },
      { key: 'action', label: 'Action', template: this.actionTemplate }
    ];

    // Subscribe to phone number changes
    this.sub.add(
      this.reservationservice.phone$.subscribe((data: any) => {
        if (data != 0) {
          this.phoneNumber = data;
          this.getPatientPackages(this.currentPage);
        } else {
          this.getPatientPackages(this.currentPage);
        }
      })
    );
  }

  getPatientPackages(page: number): void {
    if (this.phoneNumber) {
      console.log('page, size', page, this.pageSize);
      this.reservationservice.getPackages(this.phoneNumber, page, this.pageSize)
        .subscribe((data) => {
          this.dataSource.data = [...data.data];
          console.log('packages received for patient with number : ', this.phoneNumber , 'api response:' , data);
          this.totalItems = data.totalItems;
        });
    }
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