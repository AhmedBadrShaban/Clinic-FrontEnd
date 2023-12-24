import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Package } from 'src/app/modules/admin/models/package';
import { PackageService } from 'src/app/modules/admin/services/package/package.service';
import { ServiceService } from 'src/app/modules/admin/services/services/service.service';
  @Component({
  selector: 'app-add-new-package',
  templateUrl: './add-new-package.component.html',
  styleUrls: ['./add-new-package.component.css']
})
export class AddNewPackageComponent implements OnInit {

  selectedDate: any | undefined;
  newpackageFm: FormGroup;
  flag:boolean=true;
  ServiceData: any;
  constructor(private fb: FormBuilder,private packageService:PackageService , private serviceService:ServiceService  ,public dialogRef: MatDialogRef<AddNewPackageComponent>) {
    this.newpackageFm = fb.group({
      packageName: ['', [Validators.required, Validators.pattern('[A-Za-z ]{3,}')]],
      validatedDays: [null, [Validators.required, Validators.min(1)]],
      packageCost: [null, [Validators.required, Validators.min(1)]],
      numberOfPoints: [null],
      services: fb.array([this.createService()]),
    });
  }

  ngOnInit(): void {
    this.getAllAvaillableServices();

  }
  getAllAvaillableServices(){
    this.serviceService.getAllServices().subscribe((data=>{
      this.ServiceData = data;
      console.log('All Services: ', this.ServiceData);
    }))
  }
  get Services()
  {
    return this.newpackageFm.get('services') as FormArray;
  }
  createService(serviceName = '', sessions = ''): FormGroup {
    return this.fb.group({
      serviceName: [serviceName, Validators.required],
        sessions: [sessions, Validators.required]
    });
}


addService(event: any) {
  this.Services.push(this.createService());
  event.target?.classList.add('d-none');
}


  submit() {
    let userModel:any=this.newpackageFm.value ;

    if (
      userModel.services.length === 1 &&
      userModel.services[0].serviceName === '' &&
      userModel.services[0].sessions === ''
    ) {
      // Remove the 'services' array
     delete userModel.services
    }

     this.packageService.addPackage(userModel).subscribe({
      next:(responed:any)=>{
         alert(responed.message);
         this.closeDialog();
         this.UpdateAllPackages();
      },
      error: (err) => {
        alert(  err.error.message);
      }

    })

    console.log(userModel);
  }
  UpdateAllPackages(){
    this.packageService.getAllPackages().subscribe((data:any)=>{
      this.packageService.updateData(data);
      console.log( "data Updated : " ,data);
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }


}
