import { PatientService } from 'src/app/reciptianist/services/patient-server/patient.service';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientInfo } from 'src/app/reciptianist/models/patient-Info';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.css']
})
export class PatientInfoComponent implements OnInit, OnChanges  {
  @Input() info: PatientInfo[];
  formData: FormGroup;
  oldInfo: PatientInfo;

  constructor(private fb: FormBuilder , private patientService:PatientService) {}

  ngOnInit(): void {
     this.initForm(this.info[0]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const info = changes['info'] && changes['info'].currentValue;
    if (info) {
       this.initForm(info);
    }
  }
  
  initForm(info: PatientInfo): void {
    this.formData = this.fb.group({
      name:this.info[0].name,
      gender: this.info[0].gender,
      primaryPhone:this.info[0].primaryPhone,
      secondaryPhone:this.info[0].secondaryPhone,
      note: this.info[0].note,
      date:this.info[0].date,
      lastReservation: this.info[0].lastReservation,
      knowUsThrough: this.info[0].knowUsThrough
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
