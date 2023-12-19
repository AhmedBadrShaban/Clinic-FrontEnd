import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Doctors } from 'src/app/modules/admin/models/doctors';
import { DoctorsService } from 'src/app/modules/admin/services/doctors/doctors.service';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent implements OnInit {
  doctorId : string ;
  newPassword:string;
  doctorData : Doctors;
  @Input() editable : boolean = false;
  constructor(private router: Router , private route: ActivatedRoute , private docService : DoctorsService) {

  }
  ngOnInit(): void {
      this.docService.getDoctorProfile().subscribe((data)=>{
        this.doctorId = data.doctorId;
        this.doctorData=data;
        console.log('doctorData :>> ', this.doctorData);
      })
  }
  submit(){
    console.log('Updated doctorData :>> ', this.doctorData);
       delete this.doctorData.doctorId;
       delete this.doctorData.doctor;
    if(this.validateNid(this.doctorData.nationalID) && this.validatePhoneNumber(this.doctorData.phoneNumber)){
    this.docService.updateProfile(this.doctorId , this.doctorData).subscribe({
      next:(response:any)=>{
        alert(response.message)
      },
      error:(err)=>{
        alert(err.error.message)
      }
    })
  }
  else{
    alert("Invaild Data !")
  }

  }
  validatePhoneNumber(phoneNumber: string): boolean {
    const phoneNumberRegex = /^\d{11}$/;   // Regular expression for 11 digits
    return phoneNumberRegex.test(phoneNumber);
  }
  validateNid(id: string): boolean {
    const phoneNumberRegex = /^\d{14}$/;  // Regular expression for 14 digits
    return phoneNumberRegex.test(id);
  }
  updatePassword(){

  }
}
