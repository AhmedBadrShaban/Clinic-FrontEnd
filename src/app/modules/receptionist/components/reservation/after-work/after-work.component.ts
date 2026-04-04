import { ChangeDetectorRef, Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DoctorReservationsService } from 'src/app/modules/doctor/Services/doctor-reservations.service';
import { ServiceService } from 'src/app/modules/doctor/Services/service.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReservationsService } from '../../../services/reservations-services/reservations.service';

@Component({
  selector: 'app-after-work',
  templateUrl: './after-work.component.html',
  styleUrls: ['./after-work.component.css']
})
export class AfterWorkComponent implements OnInit {
  @Input() phoneNumber: string | null = null;
  @Input() id: string | null = null;
  @Input() isActive: boolean = false;
  @Input() isLaser: boolean = false;

  userType: any;
  reservationServices: string[] = [];
  editedForm!: FormGroup;
  loadingState = false;
 

  doneServicesForm: FormGroup = new FormGroup({
    dataList: new FormArray([])
  });

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AfterWorkComponent>,
    private fb: FormBuilder,
    private reservationService: ServiceService,
    private doctorService: DoctorReservationsService,
    private reservationsApi: ReservationsService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private loggedIn: AuthService
  ) {
    this.userType = loggedIn.userType;
  }

  ngOnInit(): void {
     if (this.data) {
 
      this.initEditMode();
    } else if (this.id) {
 
      this.initCreateMode();
    }
  }

  // ── Validator helpers ────────────────────────────────────────────────────

  /**
   * Returns the validators for pulse / spot / fluence1 / fluence2.
   * Mandatory when isLaser=true, optional when isLaser=false.
   */
  private laserFieldValidators(): ValidatorFn[]
{
    return this.isLaser
      ? [Validators.required, Validators.min(0)]
      : [Validators.min(0)];
  }

  // ── Init modes ───────────────────────────────────────────────────────────

  private initCreateMode(): void {
    this.loadingState = true;
    this.reservationService.getAllServices(this.id!).subscribe({
      next: (data) => {
        this.reservationServices = data;
 

        for (const service of this.reservationServices) {
          const serviceFormGroup = new FormGroup({
            service: new FormControl(service, Validators.required),
            pulse: new FormControl(null, this.laserFieldValidators()),
            spot: new FormControl(null, this.laserFieldValidators()),
            fluence1: new FormControl(null, this.laserFieldValidators()),
            fluence2: new FormControl(null, this.laserFieldValidators()),
            zimmer: new FormControl(null),          // always optional
            zeroThirty: new FormControl(false),         // always optional
            note: new FormControl('', Validators.required)  // always required
          });
          (this.doneServicesForm.get('dataList') as FormArray).push(serviceFormGroup);
        }

        this.cd.detectChanges();
        this.loadingState = false;
      },
      error: () => {
        this.loadingState = false;
      }
    });
  }

  private initEditMode(): void {
    this.reservationServices = [this.data.service];

    for (const service of this.reservationServices) {
      this.editedForm = this.fb.group({
        historyId: [this.data.historyId, Validators.required],
        service: [this.data.service, Validators.required],
        pulse: [this.data.pulse, this.laserFieldValidators()],
        fluence1: [this.data.fluence1, this.laserFieldValidators()],
        fluence2: [this.data.fluence2, this.laserFieldValidators()],
        spot: [this.data.spot, this.laserFieldValidators()],
        zimmer: [this.data.zimmer],                             // always optional
        zeroThirty: [this.data.zeroThirty],                        // always optional
        note: [this.data.note, Validators.required],   // always required
        date: [this.data.date],
        doctorName: [this.data.doctorName],
        clinic: [this.data.clinic],
      });

      (this.doneServicesForm.get('dataList') as FormArray).push(this.editedForm);
    }
  }

  // ── FormArray accessor ───────────────────────────────────────────────────

  get dataListControls() {
    return (this.doneServicesForm.get('dataList') as FormArray).controls;
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  onCancel(index: number): void {
    (this.doneServicesForm.get('dataList') as FormArray).removeAt(index);
  }

  onSubmit(): void {
    this.doneServicesForm.markAllAsTouched();
    if (this.doneServicesForm.invalid) return;

    const afterWork = this.doneServicesForm.value.dataList;
    this.doctorService.completeReservation(this.id!, afterWork).subscribe({
      next: (data: any) => {
        alert(data.message);
        this.cd.detectChanges();
        this.router.navigate(['doctor']);
      },
      error: (error: any) => {
        alert(error.error.message);
      }
    });
  }

  updateHistory(): void {
    this.doneServicesForm.markAllAsTouched();
    if (this.doneServicesForm.invalid) return;

    this.reservationsApi.updateHistory(this.editedForm.value.historyId, this.editedForm.value).subscribe({
      next: (data: any) => {
        alert(data.message);
        this.closeDialog();
        this.cd.detectChanges();
      },
      error: (error: any) => {
        alert(error.error.message);
      }
    });
  }

  cancelUpdate(): void {
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}