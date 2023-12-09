import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../Services/service.service';
import { AfterWork } from '../../Models/after-work';

@Component({
  selector: 'app-after-work',
  templateUrl: './after-work.component.html',
  styleUrls: ['./after-work.component.css']
})
export class AfterWorkComponent {
  afterWorkFm: FormGroup;
 
  serviceData: any;
  constructor(private fb: FormBuilder,private Serviceservice:ServiceService) {

    this.afterWorkFm = fb.group({
      pulses: ['', [Validators.required]],
      spot: ['', [Validators.required]],
      flunce1: ['', [Validators.required]],
      flunce2: ['', [Validators.required]],
      note: ['', [Validators.required]],

    });
  }
  submit() {
    let userModel:AfterWork=this.afterWorkFm.value as AfterWork;

    console.log(userModel);
  }


  ngOnInit(): void {
    this.Serviceservice.getAllServices().subscribe((patientdata:any)=>{
      // console.log(data);
      this.serviceData =patientdata;
      console.log( "service data recived : " ,this.serviceData);
    })
  }
}
