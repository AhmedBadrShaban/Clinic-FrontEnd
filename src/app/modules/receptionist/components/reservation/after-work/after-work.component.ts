import { ChangeDetectorRef, Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DoctorReservationsService } from 'src/app/modules/doctor/Services/doctor-reservations.service';
import { ServiceService } from 'src/app/modules/doctor/Services/service.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReservationsService } from '../../../services/reservations-services/reservations.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-after-work',
    templateUrl: './after-work.component.html',
    styleUrls: ['./after-work.component.css'],
    standalone: true,
    imports: [NgIf, MatProgressSpinnerModule, MatIconModule, FormsModule, ReactiveFormsModule, NgFor]
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
  isSubmitting = false;
  isUpdating = false;
  // ── Autocomplete state per service card ─────────────────────────────────
  filteredOptions: string[][] = [];   // filtered list per card index
  allServiceNames: string[] = [];     // full list from API
  showDropdown: boolean[] = [];       // dropdown visibility per card

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
    this.loadAllServiceNames();
    if (this.data) {
      this.initEditMode();
    } else if (this.id) {
      this.initCreateMode();
    }
  }

  // ── Load all available service names for autocomplete ───────────────────

  private loadAllServiceNames(): void {
    this.reservationService.getAvaillableService().subscribe({
      next: (data: string[]) => {
        this.allServiceNames = data;
      }
    });
  }

  // ── Autocomplete logic ───────────────────────────────────────────────────

  onServiceInput(value: string, index: number): void {
    const lower = value.toLowerCase();
    this.filteredOptions[index] = this.allServiceNames.filter(name =>
      name.toLowerCase().includes(lower)
    );
    this.showDropdown[index] = true;
    this.cd.detectChanges();
  }

  selectOption(option: string, index: number): void {
    const control = (this.doneServicesForm.get('dataList') as FormArray)
      .at(index)
      .get('service');
    control?.setValue(option);
    this.showDropdown[index] = false;
    this.cd.detectChanges();
  }

  hideDropdown(index: number): void {
    // Delay so click on option fires before blur hides the dropdown
    setTimeout(() => {
      this.showDropdown[index] = false;
      this.cd.detectChanges();
    }, 200);
  }

  // ── Validator helpers ────────────────────────────────────────────────────

  private laserFieldValidators(): ValidatorFn[] {
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

        for (let i = 0; i < this.reservationServices.length; i++) {
          const service = this.reservationServices[i];
          this.filteredOptions.push([...this.allServiceNames]);
          this.showDropdown.push(false);

          const serviceFormGroup = new FormGroup({
            service: new FormControl(service, Validators.required),
            pulse: new FormControl(null, this.laserFieldValidators()),
            spot: new FormControl(null, this.laserFieldValidators()),
            fluence1: new FormControl(null, this.laserFieldValidators()),
            fluence2: new FormControl(null, this.laserFieldValidators()),
            zimmer: new FormControl(null),
            zeroThirty: new FormControl(false),
            note: new FormControl('', Validators.required)
          });

          (this.doneServicesForm.get('dataList') as FormArray).push(serviceFormGroup);
        }

        this.cd.detectChanges();
        this.loadingState = false;
      },
      error: () => { this.loadingState = false; }
    });
  }

  private initEditMode(): void {
    this.reservationServices = [this.data.service];
    this.filteredOptions.push([...this.allServiceNames]);
    this.showDropdown.push(false);

    this.editedForm = this.fb.group({
      historyId: [this.data.historyId, Validators.required],
      service: [this.data.service, Validators.required],
      pulse: [this.data.pulse, this.laserFieldValidators()],
      fluence1: [this.data.fluence1, this.laserFieldValidators()],
      fluence2: [this.data.fluence2, this.laserFieldValidators()],
      spot: [this.data.spot, this.laserFieldValidators()],
      zimmer: [this.data.zimmer],
      zeroThirty: [this.data.zeroThirty],
      note: [this.data.note, Validators.required],
      date: [this.data.date],
      doctorName: [this.data.doctorName],
      clinic: [this.data.clinic],
    });

    (this.doneServicesForm.get('dataList') as FormArray).push(this.editedForm);
  }

  // ── FormArray accessor ───────────────────────────────────────────────────

  get dataListControls() {
    return (this.doneServicesForm.get('dataList') as FormArray).controls;
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  onCancel(index: number): void {
    (this.doneServicesForm.get('dataList') as FormArray).removeAt(index);
    this.filteredOptions.splice(index, 1);
    this.showDropdown.splice(index, 1);
  }

  onSubmit(): void {
    this.doneServicesForm.markAllAsTouched();
    if (this.doneServicesForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;

    const afterWork = this.doneServicesForm.value.dataList;

    this.doctorService.completeReservation(this.id!, afterWork).subscribe({
      next: (data: any) => {
        this.isSubmitting = false;
        alert(data.message);
        this.cd.detectChanges();
        this.router.navigate(['doctor']);
      },
      error: (error: any) => {
        this.isSubmitting = false;
        alert(error.error.message);
      }
    });
  }


  updateHistory(): void {
    this.doneServicesForm.markAllAsTouched();
    if (this.doneServicesForm.invalid || this.isUpdating) return;

    this.isUpdating = true;

    this.reservationsApi.updateHistory(
      this.editedForm.value.historyId,
      this.editedForm.value
    ).subscribe({
      next: (data: any) => {
        this.isUpdating = false;
        alert(data.message);
        this.closeDialog();
        this.cd.detectChanges();
      },
      error: (error: any) => {
        this.isUpdating = false;
        alert(error.error.message);
      }
    });
  }


  cancelUpdate(): void { this.closeDialog(); }
  closeDialog(): void { this.dialogRef.close(); }
}