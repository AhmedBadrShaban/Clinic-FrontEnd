import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Service } from 'src/app/modules/admin/models/service';
import { ServiceService } from 'src/app/modules/admin/services/services/service.service';

@Component({
  selector: 'app-add-new-service',
  templateUrl: './add-new-service.component.html',
  styleUrls: ['./add-new-service.component.css']
})
export class AddNewServiceComponent implements OnInit {
  newServiceFm: FormGroup;
  flag:boolean=true;
  allRooms:any;
  constructor(private fb: FormBuilder ,private serService:ServiceService,  private dialogRef:MatDialogRef<AddNewServiceComponent>) {
    this.newServiceFm = fb.group({
      serviceName: ['', [Validators.required, Validators.pattern('[A-Za-z]{3,}')]],
      costPerSession: ['', [Validators.required]],
      rooms: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.serService.getAllRooms().subscribe((data)=>{
      this.allRooms = data;
      console.log('allRooms :>> ', this.allRooms);
    })
  }


  submit() {
    let userModel:Service=this.newServiceFm.value as Service;
    this.serService.addService(userModel).subscribe({
      next:(response:any)=>{
       alert(response.message);
        this.closeDialog();
         this.update();
      },
      error:(err)=>{
        console.log('Error :>> ', err.error.message);
      }
    })
    console.log(userModel);
  }
  update(){
    this.serService.getAllServices().subscribe((data)=>{
      this.serService.updateData(data);
      console.log( "Services Updated : " ,data);

    })

  }
  closeDialog() {
    this.dialogRef.close();
  }
}

