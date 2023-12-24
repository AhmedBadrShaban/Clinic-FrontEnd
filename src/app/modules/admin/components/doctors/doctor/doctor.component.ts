import { Component, Input } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DoctorsService} from "../../../services/doctors/doctors.service";
import {Doctors} from "../../../models/doctors";

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent {
  doctorId : string ;
  doctorData : any;
  @Input() editable : boolean = false;
  constructor(private router: Router , private route: ActivatedRoute , private docService : DoctorsService) {
 // Subscribe to route params and query params
 this.route.params.subscribe(params => {
    this.doctorId = params['id'];
  console.log('doctorId :>> ', this.doctorId);
  this.docService.getDoctor(this.doctorId).subscribe((data)=>{
    this.doctorData= data;
    console.log('data :>> ', data);
  })

});
  }

  switchStatus(id: any) {
    this.docService.changeStatus(id).subscribe({
      next: (responed) => {
        alert(responed.message);
        location.reload();
       },
      error: (err) => {
        console.log('err :>> ', err.error.message);
      },
    });
  }
}
