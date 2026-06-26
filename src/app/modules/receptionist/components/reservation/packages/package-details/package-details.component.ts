import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReservedPackage } from 'src/app/modules/receptionist/models/package';
import { PackageService } from 'src/app/modules/receptionist/services/package-service/package.service';
import { UpdatePackageComponent } from './update-package/update-package.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-package-details',
    templateUrl: './package-details.component.html',
    styleUrls: ['./package-details.component.css'],
    standalone: true,
    imports: [NgIf, NzTableModule, NgFor]
})
export class PackageDetailsComponent implements OnInit {
  packID:string;
  packDetails: ReservedPackage;
  servicePack:boolean=false;
   constructor(private dialogRef: MatDialogRef<PackageDetailsComponent> , @Inject(MAT_DIALOG_DATA) public id: string , private packService:PackageService , private updatePackage:MatDialog ){

     this.packID = id;
    //console.log('packID :>> ', this.packID);
    this.packService.getPackageDetailsById(this.packID).subscribe((data)=>{
      this.packDetails =data;
      if(this.packDetails.reservedService.length>0){
        this.servicePack =true;
      }
      //console.log('object :>> ',  this.packDetails);

    })
  }
  ngOnInit(): void {

  }
  openUpdatePackage()
  {
    this.closeDialog();
    this.updatePackage.open(UpdatePackageComponent , {data:this.packDetails});
  }
 closeDialog() {
    this.dialogRef.close();
  }

}
