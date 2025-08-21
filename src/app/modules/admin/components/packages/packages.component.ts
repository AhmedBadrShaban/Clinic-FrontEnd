import { Component } from '@angular/core';
import {NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize} from "ng-zorro-antd/table";
import {Package} from "../../models/package";
import {PackageService} from "../../services/package/package.service";
import { AddNewPackageComponent } from './add-new-package/add-new-package.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent {
  size: NzTableSize;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;
  packages: Package[] = [];
  AllDataToSearchIn:any[];
  filteredData:  any[] = [];
  searchValue?:any;
  pageIndex: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  constructor(private pckService: PackageService,private dialogRef : MatDialog) {
      this.size= 'small' as NzTableSize;
      this.paginationType= 'default' as NzTablePaginationType;
      this.tableLayout='auto' as NzTableLayout;
      this.position= 'bottom' as NzTablePaginationPosition;
      // this.packages = pckService.getAllPackages();
  }
  ngOnInit(): void {
    this.getAllPackages(this.pageIndex);
    this.pckService.listOfData$.subscribe((data:any)=>{
      this.packages =data;
     //console.log( "Updated Data recived : " ,this.packages);
     this.autoComplete();
   })
   }
  getAllPackages(page: number = 1): void {
    const zeroBasedPage = page - 1;
    this.pckService.getAllPackages(zeroBasedPage, this.pageSize).subscribe((res: any) => {
      this.packages = res.data; // assuming backend returns { data: [...], totalItems: number }
      this.totalItems = res.totalItems;
      this.autoComplete();
      this.packages = this.packages.map(pkg => ({
        ...pkg,
        expand: pkg.services && pkg.services.length > 0
      }));
    });
  }

  onPageChange(newPage: number): void {
    this.pageIndex = newPage;
    this.getAllPackages(this.pageIndex);
  }
    switchStatus(id: any){
      this.pckService.changeStatus(id).subscribe({
        next:(responed)=>{
         alert(responed.message);
         this.getAllPackages();
        },
        error:(err)=>{
          //console.log('err :>> ', err.error.message);
        }
      })
      }
  search(page: number = 1): void {
    const zeroBasedPage = page - 1;
    this.pckService.search(this.searchValue, zeroBasedPage, this.pageSize).subscribe((res: any) => {
      this.packages = res.data || res.content; // Ensure compatibility with different backend responses
    //console.log('packages updated')
      this.totalItems = res.totalItems || this.packages.length;

      this.autoComplete(); // Add this line to match getAllPackages behavior

      this.packages = this.packages.map(pkg => ({
        ...pkg,
        expand: pkg.services && pkg.services.length > 0
      }));
    });
  }

      clearSearch(){
        this.getAllPackages();
        this.searchValue=null;
      }
    autoComplete(){
      this.AllDataToSearchIn =  this.packages.map(packages => `${packages.packageName}`);
      this.filteredData=this.AllDataToSearchIn;
      //console.log(this.filteredData);
    }
    onChange(value: string): void {
      this.filteredData = this.AllDataToSearchIn.filter(AllDataToSearchIn => AllDataToSearchIn.toLowerCase().indexOf(value.toLowerCase()) !== -1);
     }
  goToForm(){}
  openDialog(){

    this.dialogRef.open(AddNewPackageComponent );
  }


}
