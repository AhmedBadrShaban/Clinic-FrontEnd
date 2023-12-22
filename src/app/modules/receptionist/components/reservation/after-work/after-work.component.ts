import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { DoctorReservationsService } from 'src/app/modules/doctor/Services/doctor-reservations.service';
import { ServiceService } from 'src/app/modules/doctor/Services/service.service';

@Component({
  selector: 'app-after-work',
  templateUrl: './after-work.component.html',
  styleUrls: ['./after-work.component.css']
})
export class AfterWorkComponent implements OnInit {
  @Input() phoneNumber: any;
  @Input() id: any;
  reservationServices: string[] = [
    'Full legs',
    'Arms'
  ];

  doneServicesForm: FormGroup = new FormGroup({
    dataList: new FormArray([])
  });

  constructor(private reservationService: ServiceService , private doctorService:DoctorReservationsService , private router:Router) { }

  ngOnInit(): void {
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
}
