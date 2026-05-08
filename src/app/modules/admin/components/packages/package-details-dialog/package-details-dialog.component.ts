import { Component, Inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Package } from '../../../models/package';

@Component({
  selector: 'app-package-details-dialog',
  templateUrl: './package-details-dialog.component.html',
  standalone: true,
  imports: [CurrencyPipe , CommonModule],
  styleUrls: ['./package-details-dialog.component.css']
})
export class PackageDetailsDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PackageDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Package
  ) { 
    console.log('data :>> ', data);

  }

  close(): void {
    this.dialogRef.close();
  }

  get isServicePackage(): boolean {
    return !!this.data?.services?.length;
  }
}