import { Package } from './../../models/package';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize } from 'ng-zorro-antd/table';
import { AddPackageComponent } from './add-package/add-package.component';
import { PackageService } from '../../services/package-service/package.service';
import { AddProductComponent } from './add-product/add-product.component';

type TableScroll = 'unset' | 'scroll' | 'fixed';
interface Setting {
 bordered: boolean;
 loading: boolean;
 pagination: boolean;
 sizeChanger: boolean;
 title: boolean;
 header: boolean;
 footer: boolean;
 expandable: boolean;
 checkbox: boolean;
 fixHeader: boolean;
 noResult: boolean;
 ellipsis: boolean;
 simple: boolean;
 size: NzTableSize;
 tableScroll: TableScroll;
 tableLayout: NzTableLayout;
 position: NzTablePaginationPosition;
 paginationType: NzTablePaginationType;
 }
@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent implements OnInit {
  selectedDate: any | undefined;
  listOfData: readonly Package[] =[];
  displayData: readonly Package[] = [];
  allChecked = false;
  indeterminate = false;
  fixedColumn = false;
  scrollX: string | null = null;
  scrollY: string | null = null;
  settingValue: Setting;
  PatientData: any;

  ngOnInit(): void {
    this.getAllReserved();
    this.PackageService.listOfData$.subscribe((data: readonly any[]) => {
      this.listOfData = data;
    });
  }

   constructor(private dialogRef : MatDialog  ,
    private PackageService:PackageService , private datePipe:DatePipe ){
    this.selectedDate = new Date();
    this.settingValue ={
      bordered: true,
      loading: false,
      pagination: true,
      sizeChanger: true,
      title: false,
      header: true,
      footer: false,
      expandable: false,
      checkbox: false,
      fixHeader: false,
      noResult: false,
      ellipsis: false,
      simple: false,
      size: 'small' as NzTableSize,
      paginationType: 'default' as NzTablePaginationType,
      tableScroll: 'unset' as TableScroll,
      tableLayout: 'auto' as NzTableLayout,
      position: 'both' as NzTablePaginationPosition
    };
   }
   getAllReserved(){
    this.PackageService.getAllReservedPackages().subscribe((data:any)=>{
      this.listOfData =data;
     console.log( "data recived : " ,this.listOfData);
   })
   }

  openDialog(type:string){
    if(type=='Package'){
    this.dialogRef.open(AddPackageComponent);
    }
    else if(type=='Product'){
      this.dialogRef.open(AddProductComponent);
    }
  }
  onDateChange(event: any) {
    this.selectedDate = event.value;
    const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    this.PackageService.filterByDate(formattedDate).subscribe((data:any)=>{
      // console.log(data);
      this.listOfData =data;
      console.log( "Search result is  : " ,this.listOfData);
    })

  }
  clearFilter() {
    console.log('Clearing Filters ');

     this.selectedDate = null;

     this.getAllReserved();
}

  changeConfirmStatus(scheduleId: number , data:Package) {
    data.confirmed = !data.confirmed;
    this.PackageService.editPackage(scheduleId,data).subscribe({
      next: (data) => {
        },
      error: (err) => {
        console.log("error in changing confirmation status: ", err);
      }
    });
  }


}
