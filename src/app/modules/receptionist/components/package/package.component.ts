import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';

import { Package } from 'src/app/modules/receptionist/models/package';
import { PackageService } from '../../services/package-service/package.service';
 import { AddPackageComponent } from './add-package/add-package.component';
import { AddProductComponent } from './add-product/add-product.component';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReportsService } from 'src/app/modules/admin/services/reports.service';
  
@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent implements OnInit, OnDestroy {
  @ViewChild('expireTemplate', { static: true }) expireTemplate!: TemplateRef<any>;
  @ViewChild('reservedAtTemplate', { static: true }) reservedAtTemplate!: TemplateRef<any>;
  @ViewChild('receiptTemplate', { static: true }) receiptTemplate!: TemplateRef<any>;

  selectedDate: Date | null = new Date();
  tableColumns: Array<{ key: string, label: string, template?: TemplateRef<any> }> = [];

  dataSource = new MatTableDataSource<Package>();
  totalItems = 0;
  pageSize = 20;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  // ── Admin + clinic filter ─────────────────────────────────
  isAdmin = false;
  filterClinic: string | null = null;
  activeClinic: string | null = null;
  allClinics: string[] = [];
  filteredClinics: string[] = [];

  private sub = new Subscription();

  constructor(
    private dialogRef: MatDialog,
    private packageService: PackageService,
    private reportsService: ReportsService,
    private datePipe: DatePipe,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.userType === 'ROLE_ADMIN';
    this.setupColumns();
    this.getAllPackages(0);

    if (this.isAdmin) {
      this.loadClinics();
    }
  }

  setupColumns(): void {
    this.tableColumns = [
      { key: 'patientName', label: 'Patient Name' },
      { key: 'packageName', label: 'Package' },
      { key: 'expire', label: 'Expire', template: this.expireTemplate },
      {
        key: 'reservedAt',
        label: 'Reserved At',
        template: this.reservedAtTemplate
      }

    ];
  }

  // ── Clinic autocomplete ───────────────────────────────────

  private loadClinics(): void {
    this.reportsService.getAllClinics().subscribe({
      next: (data: string[]) => {
        this.allClinics = data;
        this.filteredClinics = [...data];
      },
      error: () => { }
    });
  }

  onClinicSearch(value: string): void {
    const lower = (value || '').toLowerCase();
    this.filteredClinics = this.allClinics.filter(c =>
      c.toLowerCase().includes(lower)
    );
  }

  onClinicSelected(clinic: string): void {
    // (optionSelected) fires after ngModel is committed — value is reliable here
    this.filterClinic = clinic;
    this.activeClinic = clinic;
    this.currentPage = 0;
    this.getAllPackages(0);
  }

  // ── Clinic filter actions ─────────────────────────────────

  applyClinicFilter(): void {
    this.activeClinic = this.filterClinic?.trim() || null;
    this.currentPage = 0;
    this.getAllPackages(0);
  }

  clearClinicFilter(): void {
    this.filterClinic = null;
    this.activeClinic = null;
    this.filteredClinics = [...this.allClinics];
    this.currentPage = 0;
    this.getAllPackages(0);
  }

  get hasClinicFilter(): boolean {
    return !!this.activeClinic;
  }

  // ── Data loading ──────────────────────────────────────────

  getAllPackages(page: number): void {
    this.packageService
      .getAllReservedPackages(page, this.pageSize, this.activeClinic)
      .subscribe((res: any) => {
        this.dataSource.data = [...res.data];
        this.totalItems = res.totalItems;
      });
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value;
    const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    if (formattedDate) {
      this.packageService.filterByDate(formattedDate).subscribe((res: any) => {
        this.dataSource.data = res.data;
      });
    }
  }

  clearFilter(): void {
    this.selectedDate = null;
    this.activeClinic = null;
    this.filterClinic = null;
    this.filteredClinics = [...this.allClinics];
    this.currentPage = 0;
    this.getAllPackages(0);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAllPackages(this.currentPage);
  }

  // ── Utils ─────────────────────────────────────────────────

  isExpired(expireDate: string): boolean {
    if (!expireDate) return false;
    return new Date(expireDate) < new Date();
  }

  openDialog(type: 'Package' | 'Product'): void {
    if (type === 'Package') {
      this.dialogRef.open(AddPackageComponent);
    } else if (type === 'Product') {
      this.dialogRef.open(AddProductComponent);
    }
  }

  downloadReceipt(row: Package): void {
    alert('Download receipt feature will be available soon!');
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}