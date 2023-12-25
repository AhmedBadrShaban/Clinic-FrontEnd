import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-contributor',
  templateUrl: './add-contributor.component.html',
  styleUrls: ['./add-contributor.component.css']
})
export class AddContributorComponent {

  ContributorFrm = new FormGroup({
    userName : new FormControl('' , Validators.required),
    password : new FormControl('' , Validators.required)
  })
  constructor(public dialogRef: MatDialogRef<AddContributorComponent>) {
    console.log((this.ContributorFrm))
  }
  onSubmit(){
    console.log((this.ContributorFrm))
    this.dialogRef.close()
  }
}
