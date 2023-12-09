import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Doctors } from 'src/app/Admin/models/doctors';
import { DoctorsService } from 'src/app/Admin/services/doctors/doctors.service';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent implements OnInit {
  doctorId : string ;
  doctorData : Doctors;
  @Input() editable : boolean = false;
  constructor(private router: Router , private route: ActivatedRoute , private docService : DoctorsService) {

  }
  ngOnInit(): void {
      this.docService.getDoctorProfile().subscribe((data)=>{
        this.doctorData=data;
        console.log('doctorData :>> ', this.doctorData);
      })
  }
}
