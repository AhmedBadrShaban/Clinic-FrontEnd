import { Component } from '@angular/core';
import {NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize} from "ng-zorro-antd/table";
import {Materials} from "../../models/materials";
import {MaterialsService} from "../../services/materials/materials.service";
import {MatDialog} from "@angular/material/dialog";
import {Contributor} from "../../models/contributor";
import {ContributorsService} from "../../services/Contributors/contributors.service";
import {AddContributorComponent} from "./add-contributor/add-contributor.component";

@Component({
  selector: 'app-contributors',
  templateUrl: './contributors.component.html',
  styleUrls: ['./contributors.component.css']
})
export class ContributorsComponent {

  size: NzTableSize;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;
  cont: Contributor [];
  AllDataToSearchIn:any[];
  filteredData:  any[] = [];
  searchValue?:any;
  constructor(private matServices : MaterialsService,private dialogRef : MatDialog , private conService:ContributorsService) {
    this.size= 'small' as NzTableSize;
    this.paginationType= 'default' as NzTablePaginationType;
    this.tableLayout='auto' as NzTableLayout;
    this.position= 'bottom' as NzTablePaginationPosition;

    this.cont = this.conService.getData()
  }

  goToForm(){}
  openDialog(){
    this.dialogRef.open(AddContributorComponent)
  }

  onChange(event:Event){}

  search(){}
  clearSearch(){
  }

  removeService(id : string){

  }
}
