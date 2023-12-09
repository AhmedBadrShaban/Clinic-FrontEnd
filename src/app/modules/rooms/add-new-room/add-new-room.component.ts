import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RoomsService } from '../../Services/rooms/rooms.service';

@Component({
  selector: 'app-add-new-room',
  templateUrl: './add-new-room.component.html',
  styleUrls: ['./add-new-room.component.css']
})
export class AddNewRoomComponent implements OnInit {
  newRoomFm: FormGroup;

  constructor(private fb: FormBuilder , public dialogRef: MatDialogRef<AddNewRoomComponent>  , private roomService:RoomsService){
    this.newRoomFm = fb.group({
      roomName: ['', [Validators.required, Validators.pattern('[A-Za-z]{3,}')]],
      isLaser: ['', [Validators.required]],
    });


  }

  ngOnInit(): void {

  }


  submit() {
    let userModel=this.newRoomFm.value;
    console.log(userModel);
    this.roomService.addRoom(userModel).subscribe({
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
