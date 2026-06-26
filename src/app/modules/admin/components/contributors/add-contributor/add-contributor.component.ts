import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import { ContributorsService } from '../../../services/Contributors/contributors.service';

@Component({
    selector: 'app-add-contributor',
    templateUrl: './add-contributor.component.html',
    styleUrls: ['./add-contributor.component.css'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule]
})
export class AddContributorComponent {

  ContributorFrm = new FormGroup({
    userName : new FormControl('' , Validators.required),
    password : new FormControl('' , Validators.required),
    role:new FormControl('ROLE_CONTRIBUTOR' , Validators.required)

  })
  constructor(public dialogRef: MatDialogRef<AddContributorComponent> , private contrServ:ContributorsService) {
  //console.log((this.ContributorFrm))
  }

  submit() {
    let userModel=this.ContributorFrm.value as any;
  //console.log(userModel);
    this.contrServ.addContributer(userModel).subscribe({
      next:(responed:any)=>{
         alert(responed.message);
         this.dialogRef.close()
       },
      error: (err) => {
        alert(err.error.message);

        // alert(  err.error.message);
      }

    })

    // console.log(userModel);
  }
}
