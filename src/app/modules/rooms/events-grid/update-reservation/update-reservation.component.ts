import { Component, Inject, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PatientInfo } from 'src/app/modules/receptionist/models/patient-Info';
import { PatientService } from 'src/app/modules/receptionist/services/patient-server/patient.service';

@Component({
  selector: 'app-update-reservation',
  templateUrl: './update-reservation.component.html',
  styleUrls: ['./update-reservation.component.css']
})
export class UpdateReservationComponent {
  @Input() resInfo: any;
  oldInfo: any;
  formData: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any ,private fb: FormBuilder , private patientService:PatientService) {}

  ngOnInit(): void {
    console.log('Recived Data :>> ', this.data);
    this.initForm(this.resInfo);
  }
  ngOnChanges(changes: SimpleChanges): void {
    const resInfo = changes['resInfo'] && changes['resInfo'].currentValue;
    if (resInfo) {
       this.initForm(resInfo);

    }
  }

  initForm(info: PatientInfo): void {
    this.formData = this.fb.group({
      name:this.resInfo.name,
      gender: this.resInfo.gender,
      primaryPhone:this.resInfo.primaryPhone,
      secondaryPhone:this.resInfo.secondaryPhone,
      note: this.resInfo.note,
      date:this.resInfo.date,
      lastReservation: this.resInfo.lastReservation,
      knowUsThrough: this.resInfo.knowUsThrough,
     });
    this.oldInfo = { ...this.formData.value };
  }
  update() {
    console.log('Updated info', this.formData.value);
    this.patientService.updatePatient(this.oldInfo.primaryPhone , this.formData.value).subscribe({
      next: (data) => {
        alert(data.message)
         this.oldInfo = this.formData.value;
       },
      error: (err) => {
        alert(err.error.message)
       }
    })
   }
   

}
