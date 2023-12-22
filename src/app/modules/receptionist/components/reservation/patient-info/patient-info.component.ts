import { PatientService } from 'src/app/modules/receptionist/services/patient-server/patient.service';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientInfo } from 'src/app/modules/receptionist/models/patient-Info';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.css']
})
export class PatientInfoComponent implements OnInit, OnChanges  {
  @Input() info: PatientInfo;
  @Input() phoneNumber: string;
  formData: FormGroup;
  oldInfo: PatientInfo;

  constructor(private fb: FormBuilder , private patientService:PatientService) {}

  ngOnInit(): void {
    console.log('Recived phoneNumber :>> ', this.phoneNumber);
    this.initForm(this.info);
  }
  ngOnChanges(changes: SimpleChanges): void {
    const info = changes['info'] && changes['info'].currentValue;
    if (info) {
       this.initForm(info);
    }
  }

  initForm(info: PatientInfo): void {
    this.formData = this.fb.group({
      name:this.info.name,
      gender: this.info.gender,
      primaryPhone:this.info.primaryPhone,
      secondaryPhone:this.info.secondaryPhone,
      note: this.info.note,
      date:this.info.date,
      lastReservation: this.info.lastReservation,
      knowUsThrough: this.info.knowUsThrough
    });

    this.oldInfo = { ...this.formData.value };
  }
  UpdateInfo() {
    console.log('Updated info', this.formData.value);
    this.patientService.updatePatient(this.oldInfo.primaryPhone , this.formData.value).subscribe({
      next: (data) => {
        alert('Updated Successfullly')
        this.oldInfo = this.formData.value;
       },
      error: (err) => {
        console.log("error in Updating: ", err);
      }
    })
   }
  cancel() {
    this.formData.setValue(this.oldInfo);
    console.log('Cancelled info', this.formData.value);
  }
}
