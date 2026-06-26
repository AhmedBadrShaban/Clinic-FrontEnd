 import { Component, Input, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DoctorsService} from "../../../services/doctors/doctors.service";
import {Receptionist} from "../../../models/receptionist";
import {ReceptionistsService} from "../../../services/receptionists/receptionists.service";

@Component({
  selector: 'app-receptionist',
  templateUrl: './receptionist.component.html',
  styleUrls: ['./receptionist.component.css']
})
export class ReceptionistProfileComponent implements OnInit{
  receptionistData: any;
  receptionistId: any;

  @Input() editable : boolean = false;
  constructor(private router: Router , private route: ActivatedRoute , private recpService : ReceptionistsService) {
  }
  ngOnInit(): void {
    // Subscribe to route params and query params
    this.route.params.subscribe(params => {
      this.receptionistId = params['id'];
      //console.log('receptionistId :>> ', this.receptionistId);
      this.receptionistInfo();
    });
}
receptionistInfo(){
  this.recpService.getReciptionist(this.receptionistId).subscribe((data)=>{
    this.receptionistData= data;
    console.log('object :>> ', this.receptionistData);
    //console.log('data :>> ', data);
  })
}
  switchStatus(id: any) {
    console.log('id :>> ', id);
    this.recpService.changeStatus(id).subscribe({
      next: (responed) => {
        alert(responed.message);
        this.receptionistInfo();
       },
      error: (err) => {
        //console.log('err :>> ', err.error.message);
      },
    });
  }

  update() {
    delete this.receptionistData.receptionistId;
    delete this.receptionistData.isActive;
    if (this.receptionistData.password === "") {
      delete this.receptionistData.password;
    }    //console.log('Updated Recep Data', this.receptionistData);
    this.recpService
      .updateProfile(this.receptionistId, this.receptionistData)
      .subscribe({
        next: (data: any) => {
          alert(data.message);
          this.receptionistInfo();
        },
        error: (err) => {
          alert(err.error.message);
        },
      });
  }
}
