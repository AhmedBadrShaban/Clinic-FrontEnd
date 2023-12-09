import { Component, OnInit } from '@angular/core';
import {ServiceService} from "../../services/services/service.service";
import {NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize} from "ng-zorro-antd/table";
 import {Service} from "../../models/service";
import { MatDialog } from '@angular/material/dialog';
import { AddNewServiceComponent } from './add-new-service/add-new-service.component';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  size: NzTableSize;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;
  services: Service[] = [];
  AllDataToSearchIn:any[];
  filteredData:  any[] = [];
  searchValue?:any;
   constructor(private servService : ServiceService,private dialogRef : MatDialog) {
    this.size= 'small' as NzTableSize,
      this.paginationType= 'default' as NzTablePaginationType,
      this.tableLayout='auto' as NzTableLayout,
      this.position= 'bottom' as NzTablePaginationPosition
   }
ngOnInit(): void {
  this.getAllServices();
  this.servService.listOfData$.subscribe((data:any)=>{
    this.services =data;
   console.log( "Updated Data recived : " ,this.services);
   this.autoComplete();
 })
 }
getAllServices(){
  this.servService.getAllServices().subscribe((data)=>{
    this.services = data;
    console.log('services :>> ', this.services);
    this.autoComplete();
  })
}
  // removeService(id:string){
  //   this.servService.removeServise(id);
  //   console.log("The service was removed!");
  // }
  switchStatus(id: any){
    this.servService.changeStatus(id).subscribe({
      next:(responed)=>{
       alert(responed.message);
       this.getAllServices();
      },
      error:(err)=>{
        console.log('err :>> ', err.error.message);
      }
    })
    }
    search(){
      this.servService.search(this.searchValue).subscribe((data:any)=>{
        this.services= [];
        this.services=data;
        console.log( "search recived : " ,this.services);
     })
    }
    clearSearch(){
      this.getAllServices();
      this.searchValue=null;
    }


  goToForm(){}
  openDialog(){
    this.dialogRef.open(AddNewServiceComponent);
  }
  autoComplete(){
    this.AllDataToSearchIn =  this.services.map(services => `${services.serviceName}`);
    this.filteredData=this.AllDataToSearchIn;
    console.log(this.filteredData);
  }
  onChange(value: string): void {
    this.filteredData = this.AllDataToSearchIn.filter(AllDataToSearchIn => AllDataToSearchIn.toLowerCase().indexOf(value.toLowerCase()) !== -1);
   }
}
