import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PackageService } from '../../../services/package/package.service';

export interface PriceEditDialogData {
  packageId: number;
  packageName: string;
  currentPrice: number;
}

@Component({
  selector: 'app-price-edit-dialog',
  templateUrl: './price-edit-dialog.component.html',
  styleUrls: ['./price-edit-dialog.component.css']
})
export class PriceEditDialogComponent {

  priceCtrl: FormControl;
  saving = false;

  constructor(
    private packageService: PackageService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PriceEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PriceEditDialogData
  ) {
    this.priceCtrl = new FormControl(data.currentPrice, [
      Validators.required,
      Validators.min(1)
    ]);
  }

  save(): void {
    if (this.priceCtrl.invalid) {
      this.priceCtrl.markAsTouched();
      return;
    }
    this.saving = true;
    this.packageService.updatePackagePrice(this.data.packageId, this.priceCtrl.value).subscribe({
      next: () => {
        this.saving = false;
        this.dialogRef.close(this.priceCtrl.value);
      },
      error: (err: any) => {
        this.saving = false;
        this.snackBar.open(err.error?.message ?? 'Failed to update price.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}