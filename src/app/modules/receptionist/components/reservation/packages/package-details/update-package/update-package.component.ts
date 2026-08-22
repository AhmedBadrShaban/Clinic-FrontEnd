import { AuthService } from 'src/app/shared/services/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PackageService } from 'src/app/modules/receptionist/services/package-service/package.service';

@Component({
  selector: 'app-update-package',
  templateUrl: './update-package.component.html',
  styleUrls: ['./update-package.component.css']
})
export class UpdatePackageComponent implements OnInit {
  allServices: any[] = [];
  formData: FormGroup;
  minDate: string = '';
  userType: string | null = null;
  canEditExpiry: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdatePackageComponent>,
    private fb: FormBuilder,
    private pkgApi: PackageService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.formData = this.fb.group({
      numberOfPoints: [{ value: this.data.numberOfPoints, disabled: this.data.numberOfPoints == 0 }],
      expire: [this.data.expire],
      packageName: [this.data.packageName],
      reservedAt: [this.data.reservedAt],
      reservedId: [this.data.reservedId],
      clinicName: [this.data.clinicName],
      amountOfExpense: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      reservedService: this.fb.array([])
    });
    this.setReservedServices(this.data.reservedService);
  }

  ngOnInit(): void {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.userType = this.authService.userType;
    this.canEditExpiry = this.userType === 'ROLE_ADMIN' || this.authService.isSuper === true;  // NEW
    this.minDate = `${yyyy}-${mm}-${dd}`;
  }

  get reservedServices(): FormArray {
    return this.formData.get('reservedService') as FormArray;
  }

  // ← new getter — button binds to this
  get isExpenseInvalid(): boolean {
    return this.formData.get('amountOfExpense')?.invalid ?? true;
  }

  setReservedServices(services: any[]): void {
    const serviceFGs = services.map(service => this.fb.group({
      reservedServiceId: [service.reservedServiceId],
      serviceName: [{ value: service.serviceName, disabled: true }, Validators.required],
      sessions: [service.sessions, Validators.required]
    }));
    this.formData.setControl('reservedService', this.fb.array(serviceFGs));
  }

  getMaxSessions(i: number): number {
    return this.data.reservedService[i].sessions;
  }

  update(): void {
    const payload = this.formData.getRawValue();

    this.pkgApi.updatePatientPackage(this.data.reservedId, payload).subscribe({
      next: (response: any) => {
        this.showToast(response.message, 'success');
        this.closeDialog();
      },
      error: (err) => {
        this.showToast(err.error.message, 'error');
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['snack-success'] : ['snack-error']
    });
  }
}