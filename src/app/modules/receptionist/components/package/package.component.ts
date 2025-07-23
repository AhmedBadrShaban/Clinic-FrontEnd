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

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent implements OnInit, OnDestroy {
  @ViewChild('expireTemplate', { static: true }) expireTemplate!: TemplateRef<any>;

  selectedDate: Date | null = new Date();
  tableColumns: Array<{ key: string, label: string, template?: TemplateRef<any> }> = [];

  dataSource = new MatTableDataSource<Package>();
  totalItems = 0;
  pageSize = 20;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  private sub = new Subscription();

  constructor(
    private dialogRef: MatDialog,
    private packageService: PackageService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.setupColumns();
    this.getAllPackages(0);

    // this.sub.add(
    //   this.packageService.listOfData$.subscribe((data) => {
    //     this.dataSource = data;
    //   })
    // );
  }

  setupColumns(): void {
    this.tableColumns = [
      { key: 'patientName', label: 'Patient Name' },
      { key: 'packageName', label: 'Package' },
      { key: 'expire', label: 'Expire', template: this.expireTemplate },
    ];
  }

  getAllPackages(page: number): void {
    this.packageService.getAllReservedPackages(page, this.pageSize).subscribe((res: any) => {
      console.log('res packages', res  )
      this.dataSource.data = [...res.data];
      this.totalItems = res.totalItems;
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAllPackages(this.currentPage);
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value;
    const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    if (formattedDate) {
      this.packageService.filterByDate(formattedDate).subscribe((res: any) => {
        console.log('res filter', res)
        this.dataSource.data = res.data;
      });
    }
  }

  clearFilter(): void {
    this.selectedDate = null;
    this.currentPage = 0;
    this.getAllPackages(0);
  }

  openDialog(type: 'Package' | 'Product'): void {
    if (type === 'Package') {
      this.dialogRef.open(AddPackageComponent);
    } else if (type === 'Product') {
      this.dialogRef.open(AddProductComponent);
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
