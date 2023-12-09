import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Doctors } from 'src/app/Admin/models/doctors';
import { DoctorsService } from 'src/app/Admin/services/doctors/doctors.service';
import { IPatient } from 'src/app/reciptianist/models/ipatient';

@Component({
  selector: 'app-add-new-doctor',
  templateUrl: './add-new-doctor.component.html',
  styleUrls: ['./add-new-doctor.component.css']
})
export class AddNewDoctorComponent implements OnInit {

  selectedDate: any | undefined;
  newDoctorFm: FormGroup;
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
  }

  ngOnInit(): void {
  }


  submit() {
    let userModel:Doctors=this.newDoctorFm.value as Doctors;
    console.log(userModel);
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

    console.log(userModel);
  }
  updateAllDoctors(){
    this.doctorService.getAllDoctors().subscribe((data:any)=>{
      this.doctorService.updateData(data);
      console.log( "data Updated : " ,data);
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
