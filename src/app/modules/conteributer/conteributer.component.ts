import { Component } from '@angular/core';
import {NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize} from "ng-zorro-antd/table";
import {Package} from "../admin/models/package";
import {ContData} from "./Models/cont-data";
import {ContServiceService} from "./Services/cont-service.service";

@Component({
  selector: 'app-conteributer',
  templateUrl: './conteributer.component.html',
  styleUrls: ['./conteributer.component.css']
})
export class ConteributerComponent {
  size: NzTableSize;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;
  packages: Package[] = [];
  filteredData:  any[] = [];
  searchValue?:any;
  data: ContData [];
  constructor(private conService: ContServiceService) {
    this.size= 'small' as NzTableSize;
    this.paginationType= 'default' as NzTablePaginationType;
    this.tableLayout='auto' as NzTableLayout;
    this.position= 'bottom' as NzTablePaginationPosition;
    //for testing
    this.data = this.conService.getData();
  }
}
