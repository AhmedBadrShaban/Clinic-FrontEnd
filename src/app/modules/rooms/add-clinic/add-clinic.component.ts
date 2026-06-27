import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
 import { RoomsService } from '../../Services/rooms/rooms.service';

@Component({
  selector: 'app-add-clinic',
  templateUrl: './add-clinic.component.html',
  styleUrls: ['./add-clinic.component.css']
})
export class AddClinicComponent {
  form: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddClinicComponent>,
    private roomsService: RoomsService
  ) {
    this.form = this.fb.group({
      clinicName: ['', [Validators.required, Validators.pattern('[A-Za-z ]{3,}')]]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.roomsService.addClinic(this.form.value).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.dialogRef.close('clinic-added');
      },
      error: (err) => {
        alert(err.error?.message || 'Error adding clinic');
        this.isSubmitting = false;
      }
    });
  }

  closeDialog(): void { this.dialogRef.close(); }
}