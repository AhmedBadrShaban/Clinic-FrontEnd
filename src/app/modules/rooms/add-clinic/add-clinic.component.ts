import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RoomsService } from '../../Services/rooms/rooms.service';
import { AddNewRoomComponent } from '../add-new-room/add-new-room.component';

@Component({
    selector: 'app-add-clinic',
    templateUrl: './add-clinic.component.html',
    styleUrls: ['./add-clinic.component.css'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule]
})
export class AddClinicComponent {
  newClinicFm: FormGroup;
  constructor(private fb: FormBuilder , public dialogRef: MatDialogRef<AddNewRoomComponent>  , private roomService:RoomsService){
    this.newClinicFm = fb.group({
      clinicName: ['', [Validators.required, Validators.pattern('[A-Za-z]{3,}')]],
     });
  }
  submit() {
    let userModel=this.newClinicFm.value;
    //console.log(userModel);
    this.roomService.addClinic(userModel).subscribe({
      next:(responed:any)=>{
         alert(responed.message);
         this.closeDialog();
        //  this.UpdateAllMaterials();
      },
      error: (err) => {
        alert(  err.error.message);
      }
    })
  }
  closeDialog() {
    this.dialogRef.close();
  }

}
