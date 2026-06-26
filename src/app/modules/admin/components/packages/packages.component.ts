import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Package } from '../../models/package';
import { PackageService } from '../../services/package/package.service';
import { AddNewPackageComponent } from './add-new-package/add-new-package.component';
import { PackageDetailsDialogComponent } from './package-details-dialog/package-details-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-packages',
    templateUrl: './packages.component.html',
    styleUrls: ['./packages.component.css'],
    standalone: true,
    imports: [FormsModule, NgIf, NzTableModule, NgFor, CurrencyPipe]
})
export class PackagesComponent implements OnInit {

  packages: Package[] = [];
  allDataToSearchIn: string[] = [];
  searchValue?: string;
  pageIndex = 1;
  pageSize = 10;
  totalItems = 0;
  isLoading = false;

  constructor(
    private pckService: PackageService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllPackages(this.pageIndex);

    this.pckService.listOfData$.subscribe((data: any) => {
      this.packages = data;
      this.buildAutocomplete();
    });
  }

  // ── Data Loading ──────────────────────────────────────────────

  getAllPackages(page: number = 1): void {
    this.isLoading = true;
    const zeroBasedPage = page - 1;
    this.pckService.getAllPackages(zeroBasedPage, this.pageSize).subscribe({
      next: (res: any) => {
        this.packages = this.mapPackages(res.data);
        this.totalItems = res.totalItems;
        this.buildAutocomplete();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  search(): void {
    if (!this.searchValue?.trim()) { this.getAllPackages(); return; }
    this.isLoading = true;
    this.pckService.search(this.searchValue, 0, this.pageSize).subscribe({
      next: (res: any) => {
        this.packages = this.mapPackages(res.data || res.content);
        this.totalItems = res.totalItems ?? this.packages.length;
        this.buildAutocomplete();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  clearSearch(): void {
    this.searchValue = undefined;
    this.getAllPackages();
  }

  onPageChange(newPage: number): void {
    this.pageIndex = newPage;
    this.getAllPackages(this.pageIndex);
  }

  // ── Actions ───────────────────────────────────────────────────

  switchStatus(id: any): void {
    this.pckService.changeStatus(id).subscribe({
      next: (res: any) => {
        this.showMessage(res.message, 'success');
        this.getAllPackages(this.pageIndex);
      },
      error: (err: any) => { this.showMessage(err.error?.message, 'error'); }
    });
  }
  confirmStatusChange(pkg: Package): void {
    const newStatus = pkg.isActive ? 'Inactive' : 'Active';
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        title: 'Change Status',
        message: `Set "${pkg.packageName}" to <strong>${newStatus}</strong>?`
      }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) this.switchStatus(pkg.packageId);
    });
  }
  // ── Dialogs ───────────────────────────────────────────────────

  openDialog(): void {
    const ref = this.dialog.open(AddNewPackageComponent, {
      width: '640px',
      maxHeight: '90vh',
      panelClass: 'pkg-dialog-panel',
     });
    ref.afterClosed().subscribe((saved) => {
      if (saved) this.getAllPackages(this.pageIndex);
    });
  }

  openEditDialog(pkg: Package): void {
    const ref = this.dialog.open(AddNewPackageComponent, {
      width: '640px',
      maxHeight: '90vh',
      panelClass: 'pkg-dialog-panel',
      data: pkg     
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) this.getAllPackages(this.pageIndex);
    });
  }

  openDetails(pkg: Package): void {
this.dialog.open(PackageDetailsDialogComponent, {
  width: '700px',
  maxHeight: '90vh',
  data: pkg
});
  }

  // ── Helpers ───────────────────────────────────────────────────

  private mapPackages(data: any[]): Package[] {
    return (data || []).map(pkg => ({
      ...pkg,
      expand: pkg.services?.length > 0
    }));
  }

  private buildAutocomplete(): void {
    this.allDataToSearchIn = this.packages.map(p => p.packageName);
  }

  onChange(value: string): void {
    // optional: live filter for autocomplete if needed
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  getPages(): number[] {
    const total = Math.ceil(this.totalItems / this.pageSize);
    const pages: number[] = [];
    const start = Math.max(1, this.pageIndex - 2);
    const end   = Math.min(total, this.pageIndex + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }
  showMessage(
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }
}