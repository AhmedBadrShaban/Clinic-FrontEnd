import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Package } from 'src/app/modules/admin/models/package';
import { PackageService } from 'src/app/modules/admin/services/package/package.service';
import { ServiceService } from 'src/app/modules/admin/services/services/service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgIf, NgFor } from '@angular/common';
@Component({
    selector: 'app-add-new-package',
    templateUrl: './add-new-package.component.html',
    styleUrls: ['./add-new-package.component.css'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor]
})
export class AddNewPackageComponent implements OnInit {

  newpackageFm: FormGroup;
  ServiceData: string[] = [];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private packageService: PackageService,
    private serviceService: ServiceService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddNewPackageComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Package | null
  ) {
    this.isEditMode = !!data;

    this.newpackageFm = this.fb.group({
      packageName: ['', [Validators.required ]],
      packageCost: [null, [Validators.required, Validators.min(1)]],
      numberOfPoints: [null],
      validatedDays: [null, [Validators.required, Validators.min(1)]],
      services: this.fb.array([this.createService()])
    });

    // Pre-fill form when editing
    if (data) {
      this.newpackageFm.patchValue({
        packageName: data.packageName,
        packageCost: data.packageCost,
        numberOfPoints: data.numberOfPoints,
        validatedDays: data.validatedDays
      });
      if (this.isEditMode) {
        if (this.isServicesPackage) {
          this.newpackageFm.get('numberOfPoints')?.disable();
        } else if (this.isPointsPackage) {
          this.newpackageFm.get('numberOfPoints')?.enable();
        }
      }
      // Rebuild services FormArray from existing data
      if (data.services?.length) {
        const servicesArray = this.newpackageFm.get('services') as FormArray;
        servicesArray.clear();
        data.services.forEach((s: any) => {
          servicesArray.push(this.createService(s.serviceName, s.sessions));
        });
      }
    }
  }

  ngOnInit(): void {
    this.serviceService.getAvaillableService().subscribe((data: any) => {
      this.ServiceData = data;
    });
  }

  // ── FormArray Helpers ───────────────────────────────────────

  get Services(): FormArray {
    return this.newpackageFm.get('services') as FormArray;
  }

  createService(serviceName: any = '', sessions: any = ''): FormGroup {
    const disabled = this.isEditMode && this.isPointsPackage;
    return this.fb.group({
      serviceName: [{ value: serviceName, disabled }],
      sessions: [{ value: sessions, disabled }]
    });
  }

  addService(): void {
    this.Services.push(this.createService());
  }

  removeService(index: number): void {
    this.Services.removeAt(index);
  }

  // ── Validation Helpers ──────────────────────────────────────

  touched(field: string): boolean {
    const ctrl = this.newpackageFm.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  hasError(field: string, error: string): boolean {
    const ctrl = this.newpackageFm.get(field);
    return !!(ctrl?.hasError(error) && ctrl?.touched);
  }

  // ── Submit ──────────────────────────────────────────────────

  submit(): void {
    if (this.newpackageFm.invalid) {
      this.newpackageFm.markAllAsTouched();
      return;
    }
    const hasPoints = !!this.newpackageFm.value.numberOfPoints;

    const hasServicess = this.newpackageFm.value.services?.some(
      (s: any) => s.serviceName || s.sessions
    );

    if (hasPoints && hasServicess) {
      this.showMessage(
        'Package cannot contain both points and services.',
        'error'
      );
      return;
    }

    if (!hasPoints && !hasServicess) {
      this.showMessage(
        'Package must contain either points or services.',
        'error'
      );
      return;
    }
    const payload: any = { ...this.newpackageFm.value };

    // Strip empty services array (Points-only package)
    const hasServices = payload.services?.some(
      (s: any) => s.serviceName !== '' || s.sessions !== ''
    );
    if (!hasServices) {
      delete payload.services;
    }

    if (this.isEditMode && this.data) {
      // ── Edit mode
      this.packageService.updatePackage(this.data.packageId, payload).subscribe({
        next: (res: any) => {
          this.showMessage(res.message ?? 'Package updated successfully.' , 'success');
          this.dialogRef.close(true);
        },
        error: (err: any) => this.showMessage(
          err.error?.message ?? 'Update failed.',
          'error'
        )
      });
    } else {
      // ── Add mode
      this.packageService.addPackage(payload).subscribe({
        next: (res: any) => {
          this.showMessage(
            res.message ?? 'Package added successfully.',
            'success'
          );          this.dialogRef.close(true);
        },
        error: (err: any) => this.showMessage(
          err.error?.message ?? 'Add failed.',
          'error'
        )
      });
    }
  }
  get hasServices(): boolean {
    return this.Services.controls.some(ctrl => {
      const value = ctrl.value;
      return value.serviceName || value.sessions;
    });
  }

  get hasPoints(): boolean {
    return !!this.newpackageFm.get('numberOfPoints')?.value;
  }
  
  get isServicesPackage(): boolean {
  return !!(this.data?.services?.length);
}

get isPointsPackage(): boolean {
  return !!(this.data?.numberOfPoints && !this.data?.services?.length);
}
clearServices(): void {
    this.Services.clear();
    this.Services.push(this.createService());
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
  closeDialog(): void {
    this.dialogRef.close(false);
  }
}