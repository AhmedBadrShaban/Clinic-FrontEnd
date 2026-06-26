import { Component, OnInit } from '@angular/core';
import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize, NzTableModule } from "ng-zorro-antd/table";
import {Package} from "../admin/models/package";
import {ContData} from "./Models/cont-data";
import {ContServiceService} from "./Services/cont-service.service";
import { DatePipe, NgFor } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReportsComponent } from '../../shared/components/reports/reports.component';
import { NavBarContComponent } from './Components/nav-bar-cont/nav-bar-cont.component';

@Component({
    selector: 'app-conteributer',
    templateUrl: './conteributer.component.html',
    styleUrls: ['./conteributer.component.css'],
    standalone: true,
    imports: [NavBarContComponent, ReportsComponent, MatFormFieldModule, MatInputModule, FormsModule, MatDatepickerModule, NzTableModule, NgFor]
})
export class ConteributerComponent implements OnInit {
  size: NzTableSize;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;
  selectedDate: any =new Date();
  data: ContData []=[];
  constructor(private conService: ContServiceService , private datePipe: DatePipe) {
    this.size= 'small' as NzTableSize;
    this.paginationType= 'default' as NzTablePaginationType;
    this.tableLayout='auto' as NzTableLayout;
    this.position= 'bottom' as NzTablePaginationPosition;
    //for testing
   }
  ngOnInit(): void {
    this.getReport();
  }


  onDateChange(event: any) {
    this.selectedDate = event.value;
     this.getReport();

  }
  getReport(){
  this.conService.getMonthlyReport(this.getYear(this.selectedDate) , this.getMonth(this.selectedDate)).subscribe((report)=>{
    this.data = report;
  //console.log('data :>> ', this.data);

   })
}

  getYear(date: Date): any {
    return new DatePipe('en-US').transform(date, 'y');
  }

  getMonth(date: Date): any {
    return new DatePipe('en-US').transform(date, 'M');
  }
}
