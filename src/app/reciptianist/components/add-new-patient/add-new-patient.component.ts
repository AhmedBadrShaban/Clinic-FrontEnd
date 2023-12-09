import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IPatient } from 'src/app/reciptianist/models/ipatient';
import { PatientService } from '../../services/patient-server/patient.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-new-patient',
  templateUrl: './add-new-patient.component.html',
  styleUrls: ['./add-new-patient.component.css']
})
export class AddNewPatientComponent implements OnInit {
  selectedDate: any | undefined;
  newPatientFm: FormGroup;
  flag:boolean=true;
  constructor(private fb: FormBuilder , private router: Router ,  public newPatient:PatientService ) {
    this.newPatientFm = fb.group({
      name: ['', [Validators.required, Validators.pattern('[A-Za-z]{3,}')]],
      note: ['', [Validators.required]],
      primaryPhone: ['', []],
      secondaryPhone: ['', [Validators.required]],
      knowUsThrough: ['', [Validators.required]],
      date: ['', [Validators.required]],
      gender: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  get fullName() {
    return this.newPatientFm.get('fullName');
  }

  get email() {
    return this.newPatientFm.get('email');
  }

  get phoneNumbers() {
    return this.newPatientFm.get('phones') as FormArray;
  }


  submit() {
    let userModel:IPatient=this.newPatientFm.value as IPatient;
    this.newPatient.addNewPatient(userModel).subscribe({
      next: (data) => {
        alert("Succssefully Added New Patient! ")
        location.reload();
       },
      error: (err) => {
        alert("error in posting: " + err);
      }

    });
   }


}
