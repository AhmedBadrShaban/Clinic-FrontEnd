import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaymentService } from 'src/app/modules/receptionist/services/payment/payment.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css'],
    standalone: true,
    imports: [FormsModule]
})
export class PaymentComponent implements OnInit {
  resInfo:any = {
    patientPhone:"01120120201",
    patientName:"Mariam",
  };

  paymentData: any = {
     packageName: '',
    packageCost:'0',
     cash:null ,
    visa:null,
    debit:null,
    credit:null,
    instaPay:null,
    vodafoneCash:null,
   };

  constructor(  @Inject(MAT_DIALOG_DATA) public data: any , private dialogRef: MatDialogRef<PaymentComponent> , paymentService:PaymentService ){

  }

  ngOnInit(): void {

  }

  submit(){

  }

}
