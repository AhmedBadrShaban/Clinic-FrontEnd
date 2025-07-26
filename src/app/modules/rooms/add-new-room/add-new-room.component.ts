import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoomsService } from '../../Services/rooms/rooms.service';

@Component({
  selector: 'app-add-new-room',
  templateUrl: './add-new-room.component.html',
  styleUrls: ['./add-new-room.component.css']
})
export class AddNewRoomComponent implements OnInit {
   newRoomFm: FormGroup;
   clinics:string[]=[]

  constructor(  private fb: FormBuilder , public dialogRef: MatDialogRef<AddNewRoomComponent>  , private roomService:RoomsService){


    this.newRoomFm = fb.group({
      roomName: ['', [Validators.required, Validators.pattern('[A-Za-z]{3,}')]],
      isLaser: ['', [Validators.required]],
      clinicName: ['', [Validators.required]],
    });


  }

  ngOnInit(): void {
    this.roomService.allClinics().subscribe((data)=>{
      this.clinics=data;
    })

  }


  submit() {
    let userModel=this.newRoomFm.value;
    //console.log(userModel);
    this.roomService.addRoom(userModel).subscribe({
      next:(responed:any)=>{
         alert(responed.message);
        this.updateRooms();
         this.closeDialog();
        //  this.UpdateAllMaterials();
      },
      error: (err) => {
        alert(  err.error.message);
      }
    })
  }
  updateRooms(){
    this.roomService.getAllRoomsV2().subscribe((data)=>{
      this.roomService.updateRooms(data);
    })
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
