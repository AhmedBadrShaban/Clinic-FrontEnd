import { Component, Input, OnInit } from '@angular/core';
import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize } from 'ng-zorro-antd/table';
import { patientPackages } from 'src/app/modules/receptionist/models/patient-packages';
import { ReservationsService } from '../../../services/reservations-services/reservations.service';
import { MatDialog } from '@angular/material/dialog';
import { PackageDetailsComponent } from './package-details/package-details.component';

type TableScroll = 'unset' | 'scroll' | 'fixed';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit {

  size: NzTableSize;
  tableScroll: TableScroll;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;
   packages:patientPackages[];
  @Input() phoneNumber:any;

  constructor(private reservationservice: ReservationsService , private dialogRef : MatDialog){
    this.size= 'small' as NzTableSize,
      this.paginationType= 'default' as NzTablePaginationType,
      this.tableScroll='unset' as TableScroll,
      this.tableLayout='auto' as NzTableLayout,
      this.position= 'bottom' as NzTablePaginationPosition
  }
ngOnInit(){
  console.log('packages ini :>> ' );
  console.log('Recived packages phoneNumber :>> ', this.phoneNumber);
  this.reservationservice.phone$.subscribe((data:any) => {
    console.log('Updated packages phoneNumber :>> ', this.phoneNumber);
    if(data!=0){
      this.phoneNumber = data;
      this.getPatientPackages();
    }
    else{
      this.getPatientPackages();
    }
  });
  }

 getPatientPackages(){
  if(this.phoneNumber){
  this.reservationservice.getPackages(this.phoneNumber).subscribe((data)=>{
    this.packages = data;
    console.log(' Packages :>> ' , this.packages );
  })
  }
 }
 openDialog(id:string){

  this.dialogRef.open(PackageDetailsComponent , {data:id});
}

}
