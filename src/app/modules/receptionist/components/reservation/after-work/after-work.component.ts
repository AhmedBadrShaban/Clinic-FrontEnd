import { ChangeDetectorRef, Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
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

  private initCreateMode(): void {
    this.loadingState = true;
    this.reservationService.getAllServices(this.id!).subscribe({
      next: (data) => {
        this.reservationServices = data;
        for (const service of this.reservationServices) {
          const serviceFormGroup = new FormGroup({
            service: new FormControl(service, Validators.required),
            pulse: new FormControl(null, [Validators.required, Validators.min(0)]),
            spot: new FormControl(null, [Validators.required, Validators.min(0)]),
            fluence1: new FormControl(null, [Validators.required, Validators.min(0)]),
            fluence2: new FormControl(null, [Validators.required, Validators.min(0)]),
            zimmer: new FormControl(null),        // optional
            oneThird: new FormControl(false),       // optional checkbox
            note: new FormControl('', Validators.required)
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
        pulse: [this.data.pulse, [Validators.required, Validators.min(0)]],
        fluence1: [this.data.fluence1, [Validators.required, Validators.min(0)]],
        fluence2: [this.data.fluence2, [Validators.required, Validators.min(0)]],
        spot: [this.data.spot, [Validators.required, Validators.min(0)]],
        zimmer: [this.data.zimmer ?? null],   // optional
        oneThird: [this.data.oneThird ?? false],  // optional checkbox
        note: [this.data.note, Validators.required],
        date: [this.data.date],
        doctorName: [this.data.doctorName],
        clinic: [this.data.clinic],
      });
      (this.doneServicesForm.get('dataList') as FormArray).push(this.editedForm);
    }
  }

  get dataListControls() {
    return (this.doneServicesForm.get('dataList') as FormArray).controls;
  }

  onCancel(index: number): void {
    (this.doneServicesForm.get('dataList') as FormArray).removeAt(index);
  }

  onSubmit(): void {
    // Mark all fields touched to show validation errors
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