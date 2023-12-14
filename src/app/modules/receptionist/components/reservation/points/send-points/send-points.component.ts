 import { Component, ViewEncapsulation ,Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddPackageComponent } from '../../../package/add-package/add-package.component';
import { PatientService } from 'src/app/modules/receptionist/services/patient-server/patient.service';

@Component({
  selector: 'app-send-points',
  templateUrl: './send-points.component.html',
  styleUrls: ['./send-points.component.css']
})
export class SendPointsComponent implements OnInit {
  AllNumbers:any[]=[];
  filteredNumbers: string[] = [];
  formData: any = {
    senderPhone: '',
    receiverPhone:'',
    theAmount:null
   };
  constructor(@Inject(MAT_DIALOG_DATA) public data:any , private dialogRef: MatDialogRef<SendPointsComponent> ,  private patientservice: PatientService){
    this.formData.senderPhone = data;
    console.log('phonnnnne :>> ', data);
  }

  ngOnInit(): void {

    this.patientservice.getAllPatientsNumbers().subscribe((numbers: any) => {
      this.AllNumbers = numbers;
      console.log('patientNumbers :>> ', this.AllNumbers);
      this.filteredNumbers = this.AllNumbers;
    });
  }
  submit() {
    console.log('Form Data:', this.formData);
    if(this.formData.receiverPhone === this.formData.senderPhone){
      alert("Sender and Recever are the Same Patient !!")
      return;
    }
    this.patientservice.sendPoints(this.formData).subscribe({
      next:(response:any)=>{
          alert(response.message)
          this.closeDialog();
          this.updateTotalPoints();
          this.updatePointHistory();
      },
      error:(err)=>{
        alert(err.error.message)
      }
    })
  }
  updatePointHistory(){
    this.patientservice.updatePointsHistory(this.formData.senderPhone).subscribe((data)=>{
      this.patientservice.updateListOfData(data);
      console.log( "History Updated : " ,data);
    })
  }
  updateTotalPoints(){
    this.patientservice.updateTotalOut(this.formData.theAmount);
  }
  onChange(value: string): void {
    this.filteredNumbers = this.AllNumbers.filter(AllNumbers => AllNumbers.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
  closeDialog() {
    this.dialogRef.close(SendPointsComponent);
  }
}
