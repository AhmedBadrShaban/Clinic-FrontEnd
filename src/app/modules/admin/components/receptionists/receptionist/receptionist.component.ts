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
      console.log('receptionistId :>> ', this.receptionistId);
      this.recpService.getReciptionist(this.receptionistId).subscribe((data)=>{
        this.receptionistData= data;
        console.log('data :>> ', data);
      })
    });
}
  switchStatus(id: any) {
    this.recpService.changeStatus(id).subscribe({
      next: (responed) => {
        alert(responed.message);
       },
      error: (err) => {
        console.log('err :>> ', err.error.message);
      },
    });
  }
}
