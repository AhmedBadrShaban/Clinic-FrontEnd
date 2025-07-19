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
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  @Input() phoneNumber:any;

  constructor(private reservationservice: ReservationsService , private dialogRef : MatDialog){
    this.size= 'small' as NzTableSize,
      this.paginationType= 'default' as NzTablePaginationType,
      this.tableScroll='unset' as TableScroll,
      this.tableLayout='auto' as NzTableLayout,
      this.position= 'bottom' as NzTablePaginationPosition
  }
ngOnInit(){
  //console.log('packages ini :>> ' );
  //console.log('Recived packages phoneNumber :>> ', this.phoneNumber);
  this.reservationservice.phone$.subscribe((data:any) => {
    //console.log('Updated packages phoneNumber :>> ', this.phoneNumber);
    if(data!=0){
      this.phoneNumber = data;
      this.getPatientPackages(this.currentPage);
    }
    else{
      this.getPatientPackages(this.currentPage);
    }
  });
  }

  getPatientPackages(page: number){
  if(this.phoneNumber){
    const zeroBasedPage = page - 1;
    console.log('page , size', page - 1, this.pageSize)
    this.reservationservice.getPackages(this.phoneNumber, zeroBasedPage, this.pageSize).subscribe((data)=>{
    this.packages = [...data.data];
    console.log('packages recived', this.packages)
    this.totalItems = data.totalItems;
    this.currentPage = this.currentPage + 1;  
    //console.log(' Packages :>> ' , this.packages );
  })
  }
 }
 openDialog(id:string){

  this.dialogRef.open(PackageDetailsComponent , {data:id});
}
  onPackagesPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.getPatientPackages(this.currentPage);
  }
}
