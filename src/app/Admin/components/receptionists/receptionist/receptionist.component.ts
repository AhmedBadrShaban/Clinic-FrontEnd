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
export class ReceptionistComponent implements OnInit{
  receptionistData: any;
  @Input() editable : boolean = false;
  constructor(private router: Router , private route: ActivatedRoute , private recpService : ReceptionistsService) {
  }
  ngOnInit(): void {
    // Subscribe to route params and query params
    this.route.params.subscribe(params => {
      // const id = params['id'];

      // Retrieve additional data from queryParams
      this.route.queryParams.subscribe(queryParams => {
        this.receptionistData =queryParams;
         console.log('Additional data:', this.receptionistData);


      });
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
