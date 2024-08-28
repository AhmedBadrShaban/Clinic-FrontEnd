import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Doctors } from 'src/app/modules/admin/models/doctors';
import { DoctorsService } from 'src/app/modules/admin/services/doctors/doctors.service';
import { IPatient } from 'src/app/modules/receptionist/models/ipatient';

@Component({
  selector: 'app-add-new-doctor',
  templateUrl: './add-new-doctor.component.html',
  styleUrls: ['./add-new-doctor.component.css']
})
export class AddNewDoctorComponent implements OnInit {

  selectedDate: any | undefined;
  newDoctorFm: FormGroup;
  displayError = false;
  flag:boolean=true;
  constructor(private fb: FormBuilder , private doctorService:DoctorsService , public dialogRef: MatDialogRef<AddNewDoctorComponent>) {
    this.newDoctorFm = fb.group({
      doctorName: ['', [Validators.required, Validators.pattern('[A-Za-z]{3,}')]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      phoneNumber: ['', []],
      nationalID: ['', [Validators.required]],
      address: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      pricePerHour: ['', [Validators.required]],
      laser: ['', [Validators.required]],
      laserCost: ['', [Validators.required]],
      pulsesPercentage: ['', [Validators.required]],
      role: ['ROLE_DOCTOR', [Validators.required]],
    });
    this.newDoctorFm.get('phoneNumber')?.valueChanges.subscribe(() => {
      this.displayError = !this.validatePhoneNumber();
    });
  }

  ngOnInit(): void {
  }


  submit() {
    let userModel:Doctors=this.newDoctorFm.value as Doctors;
    //console.log(userModel);
    this.doctorService.addDoctor(userModel).subscribe({
      next:(responed:any)=>{
         alert("User Added Successfully");
         this.closeDialog();
         this.updateAllDoctors();
      },
      error: (err) => {
        alert(err.error.message);

        // alert(  err.error.message);
      }

    })

    //console.log(userModel);
  }
  updateAllDoctors(){
    this.doctorService.DoctorsReport().subscribe((data:any)=>{
      this.doctorService.updateData(data);
      //console.log( "data Updated : " ,data);
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }
  validatePhoneNumber(): boolean {
    const phoneNumber = this.newDoctorFm.get('phoneNumber');
    if (phoneNumber && phoneNumber.value) {
       const phoneNumberRegex = /^\d{11}$/;
      return phoneNumberRegex.test(phoneNumber.value);
    }
    return false;
  }
}
