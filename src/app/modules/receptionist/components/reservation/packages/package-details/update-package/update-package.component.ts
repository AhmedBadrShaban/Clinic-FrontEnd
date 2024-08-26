import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PackageService } from 'src/app/modules/receptionist/services/package-service/package.service';

@Component({
  selector: 'app-update-package',
  templateUrl: './update-package.component.html',
  styleUrls: ['./update-package.component.css']
})
export class UpdatePackageComponent {
  allServices:any[]=[];
  formData: FormGroup;
  minDate: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any , public dialogRef: MatDialogRef<UpdatePackageComponent> ,
   private fb: FormBuilder ,private pkgApi:PackageService) {
    this.formData = this.fb.group({
      numberOfPoints:[{ value:this.data.numberOfPoints, disabled: this.data.numberOfPoints==0 }],
      expire:[this.data.expire],
      packageName:[this.data.packageName],
      reservedAt:[this.data.reservedAt],
      reservedId:[this.data.reservedId],
      clinicName:[this.data.clinicName],
      amountOfExpense: [ null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      reservedService: this.fb.array([])
    });
    this.setReservedServices(this.data.reservedService);
   }

  ngOnInit(): void {
    console.log('Before Package Update: :>> ', this.data);
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const dd = String(today.getDate()).padStart(2, '0');

    this.minDate = `${yyyy}-${mm}-${dd}`;

   }
   get reservedServices(): FormArray {
    return this.formData.get('reservedService') as FormArray;
  }
  setReservedServices(services: any[]): void {
    const serviceFGs = services.map(service => this.fb.group({
      reservedServiceId: [service.reservedServiceId],
      serviceName: [{ value: service.serviceName, disabled: true } , Validators.required],
      sessions: [service.sessions, Validators.required]
    }));
    const serviceFormArray = this.fb.array(serviceFGs);
    this.formData.setControl('reservedService', serviceFormArray);
  }

  getMaxSessions(i:number): number {

    console.log('Current Service:>> ',this.data.reservedService[i]);
    console.log('Current Max Sessions :>> ', this.data.reservedService[i].sessions);
    return this.data.reservedService[i].sessions;
 }

  update(): void {
    if (this.formData.valid) {
        // this.formData.value.services = selectedServices;
       console.log('After Package Update:', this.formData.value);
     } else {
        alert('Please Enter The Expense!');
        return;
     }
    this.pkgApi.updatePatientPackage(this.data.reservedId,this.formData.value).subscribe({
      next:(responed:any)=>{
        alert(responed.message)
        //  this.UpdateAllReservations();
        //  this.updateAvailableSlots();
        this.closeDialog();

     },
     error: (err) => {
       alert(err.error.message);
      }
    })
  }


  // UpdateAllReservations(){
  //   this.roomService.getAllReservations(this.data.reservationDate).subscribe((data:any)=>{
  //     this.roomService.updateData(data);
  //     console.log( "data Updated : " ,data);
  //   })
  // }

  closeDialog() {
    this.dialogRef.close();
  }

}
