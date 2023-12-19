import { AuthService } from './../../../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IPatient } from 'src/app/modules/receptionist/models/ipatient';
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
  displayError = false;
  displayError2 = false;
  constructor(private fb: FormBuilder , private router: Router ,  public newPatient:PatientService , private authService:AuthService ) {
    this.newPatientFm = fb.group({
      name: ['', [Validators.required, Validators.pattern('[A-Za-z]{3,}')]],
      note: ['', [Validators.required]],
      primaryPhone: ['', [Validators.required]],
      secondaryPhone: ['', [Validators.required]],
      knowUsThrough: ['', [Validators.required]],
      date: ['', [Validators.required]],
      gender: ['', [Validators.required]],
    });
    this.newPatientFm.get('primaryPhone')?.valueChanges.subscribe(() => {
      this.displayError = !this.validatePhoneNumber(true);
    });
    this.newPatientFm.get('secondaryPhone')?.valueChanges.subscribe(() => {
      this.displayError2 = !this.validatePhoneNumber(false);
     });
  }

  ngOnInit(): void {
  }

  submit() {
    let userModel:IPatient=this.newPatientFm.value as IPatient;
    this.newPatient.addNewPatient(userModel).subscribe({
      next: (data:any) => {
        alert(data.message)
         if(this.authService.userType === 'ROLE_RESEPTIANIST')
              this.router.navigateByUrl('receptionist/addpatient')
            else if(this.authService.userType === 'ROLE_RESEPTIANIST')
            {
              this.router.navigateByUrl('admin/addpatient')
            }
        },
      error: (err) => {
        console.log('err :>> ', err);
        alert(err.error);
      }

    });
   }
   validatePhoneNumber(o:boolean): boolean {
    if(o){
    const primaryPhoneControl = this.newPatientFm.get('primaryPhone');
    if (primaryPhoneControl && primaryPhoneControl.value) {
      const phoneNumberRegex = /^\d{11}$/;   // Regular expression for 11 digits
      return phoneNumberRegex.test(primaryPhoneControl.value);
    }
    }
    else{
      const sPhone = this.newPatientFm.get('secondaryPhone');
      if (sPhone && sPhone.value) {
        const phoneNumberRegex = /^\d{11}$/;   // Regular expression for 11 digits
        return phoneNumberRegex.test(sPhone.value);
      }

    }



    return false;  // Return false if control is null or has no value
  }

}
