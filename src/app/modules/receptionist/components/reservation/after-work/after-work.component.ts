import { formatDate } from '@angular/common';
import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DoctorReservationsService } from 'src/app/modules/doctor/Services/doctor-reservations.service';
import { ServiceService } from 'src/app/modules/doctor/Services/service.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReservationsService } from '../../../services/reservations-services/reservations.service';

@Component({
  selector: 'app-after-work',
  templateUrl: './after-work.component.html',
  styleUrls: ['./after-work.component.css']
})
export class AfterWorkComponent implements OnInit {
  userType:any;
  @Input() phoneNumber: any;
  @Input() id: any;
  reservationServices: string[] = [
  ];
  editedForm: FormGroup;
  doneServicesForm: FormGroup = new FormGroup({
    dataList: new FormArray([])
  });

  constructor( @Optional() @Inject(MAT_DIALOG_DATA) public data:any,public dialogRef: MatDialogRef<AfterWorkComponent> ,private fb: FormBuilder ,  private reservationService: ServiceService ,
  private doctorService:DoctorReservationsService , private reservationsApi:ReservationsService, private router:Router ,   private loggedIn:AuthService) {
    this.userType = loggedIn.userType;
   }

  ngOnInit(): void {
    if(!this.data){
      console.log('Received afterWork reservation ID :>> ', this.id);
      this.reservationService.getAllServices(this.id).subscribe((data) => {
        this.reservationServices = data;
      for (const service of this.reservationServices) {
        const serviceFormGroup = new FormGroup({
          service: new FormControl(service, Validators.required),
          pulse: new FormControl(0, Validators.min(0)),
          spot: new FormControl(0, Validators.min(0)),
          fluence1: new FormControl(0, Validators.min(0)),
          fluence2: new FormControl(0, Validators.min(0)),
          note: new FormControl('')
        });
        (this.doneServicesForm.get('dataList') as FormArray).push(serviceFormGroup);
      }
    });
    }
    else{
      console.log("received History Data is: ", this.data);
      this.reservationServices[0] =this.data.service;
      for (const service of this.reservationServices) {
        this.editedForm = this.fb.group({
          historyId: [this.data.historyId, Validators.required],
          service:[this.data.service],
          pulse:[this.data.pulse],
          fluence1:[this.data.fluence1],
          fluence2: [this.data.fluence2, Validators.required],
          spot: [this.data.spot, Validators.required],
          note: [this.data.note, Validators.required],
          date:[this.data.date],
          doctorName:[this.data.doctorName],
          clinic:[this.data.clinic],
        });
        (this.doneServicesForm.get('dataList') as FormArray).push(this.editedForm);
      }
    }
  }

  get dataListControls() {
    return (this.doneServicesForm.get('dataList') as FormArray).controls;
  }

  onCancel(index: number): void {
    (this.doneServicesForm.get('dataList') as FormArray).removeAt(index);
  }

  onSubmit() {
   const  afterWork = this.doneServicesForm.value.dataList;
    console.log(this.doneServicesForm.value.dataList);
    this.doctorService.completeReservation(this.id ,afterWork).subscribe({
      next: (data: any) => {
        alert(data.message);
        this.router.navigate(['doctor']);
       },
      error: (error: any) =>{
        alert(error.error.message);
      }
    })
}
updateHistory(){
  console.log('Updated Data is  :>> ' , this.editedForm.value  );
  this.reservationsApi.updateHistory( this.editedForm.value.historyId ,  this.editedForm.value).subscribe({
 next: (data: any) => {
        alert(data.message);
        this.closeDialog();
        this.UpdatePatientHistory();
        },
      error: (error: any) =>{
        alert(error.error.message);
      }
  })
}
cancelUpdate(){
  this.closeDialog();
}
UpdatePatientHistory(){
     this.reservationsApi.getHistory(this.data.phoneNumber).subscribe((data:any)=>{
  // Update the parent component's listOfData
     this.reservationsApi.updatePatientHistory(data);
      console.log( "data Updated : " ,data);
    })
}
closeDialog() {
  this.dialogRef.close();
}

}
