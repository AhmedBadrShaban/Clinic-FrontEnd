import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import {MaterialsService} from "../../services/materials/materials.service";
import {Materials, product} from "../../models/materials";
import {NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize} from "ng-zorro-antd/table";
import { MatDialog } from '@angular/material/dialog';
import { AddNewMatrialComponent } from './add-new-matrial/add-new-matrial.component';

@Component({
  selector: 'app-materials',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css']

})
export class MaterialsComponent implements OnInit {
  size: NzTableSize;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;
  materials: Materials [];
  products: product[] = []
   AllDataToSearchIn:any[];
   filteredData:  any[] = [];
  searchValue?:any;
  constructor(private matServices : MaterialsService,private dialogRef : MatDialog) {
    this.size= 'small' as NzTableSize;
      this.paginationType= 'default' as NzTablePaginationType;
      this.tableLayout='auto' as NzTableLayout;
      this.position= 'bottom' as NzTablePaginationPosition;
   }
   ngOnInit(): void
   {
    this.getAllMaterials();
    this.matServices.listOfData$.subscribe((data:any)=>{
       this.materials = data;
      //console.log( "Updated Data recived : " ,this.materials);
      this.autoComplete();
    })

     this.matServices.productsReport().subscribe((data)=>{
      this.products = data;
     })
  }
  getAllMaterials(){
    this.matServices.getAllMaterials().subscribe((data)=>{
      this.materials = data;
      //console.log('materials :>> ', this.materials);
      this.autoComplete();

    })
  }
  autoComplete(){
    this.AllDataToSearchIn =  this.materials.map(materials => `${materials.materialName}`);
    this.filteredData=this.AllDataToSearchIn;
    //console.log(this.filteredData);
  }
  goToForm(){}
  search(){
    this.matServices.search(this.searchValue).subscribe((data:any)=>{
      this.materials= [];
      this.materials[0]=data;
      //console.log( "search recived : " ,this.materials);
   })
  }
  clearSearch(){
    this.getAllMaterials();
    this.searchValue=null;
  }
  openDialog(){
    this.dialogRef.open(AddNewMatrialComponent);
  }
  removeService(id: string){}


  onChange(value: string): void {
    this.filteredData = this.AllDataToSearchIn.filter(AllDataToSearchIn => AllDataToSearchIn.toLowerCase().indexOf(value.toLowerCase()) !== -1);
   }
}
