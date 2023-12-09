import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Receptionist } from 'src/app/Admin/models/receptionist';
import { ReceptionistsService } from 'src/app/Admin/services/receptionists/receptionists.service';

@Component({
  selector: 'app-add-new-receptionist',
  templateUrl: './add-new-receptionist.component.html',
  styleUrls: ['./add-new-receptionist.component.css']
})
export class AddNewReceptionistComponent implements OnInit {
  selectedDate: any | undefined;
  newRecpFm: FormGroup;
  flag:boolean=true;
  constructor(private fb: FormBuilder ,private reciptianistService:ReceptionistsService , public dialogRef: MatDialogRef<AddNewReceptionistComponent>) {
    this.newRecpFm = fb.group({
      name: ['', [Validators.required, Validators.pattern('[A-Za-z]{3,}')]],
      email: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      nationalId: ['', [Validators.required]],
      address: ['', [Validators.required]],
      username: ['', [Validators.required]],
      salary: ['', [Validators.required]],
      password: ['', [Validators.required]],
      role: ['ROLE_RECEPTIONIST', [Validators.required]],
    });
  }

  ngOnInit(): void {
  }


  submit() {
    let userModel:Receptionist=this.newRecpFm.value as Receptionist;
    this.reciptianistService.addReciptianist(userModel).subscribe({
      next:(responed:any)=>{
         alert("User Added Successfully");
         this.closeDialog();
         this.UpdateAllReciptianist();
      },
      error: (err) => {
        alert(err.error.message);

        // alert(  err.error.message);
      }

    })
    console.log(userModel);
  }
  UpdateAllReciptianist(){
    this.reciptianistService.getAllReciptianist().subscribe((data:any)=>{
      this.reciptianistService.updateData(data);
      console.log( "data Updated : " ,data);
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
