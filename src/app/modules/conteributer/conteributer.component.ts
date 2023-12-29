import { Component, OnInit } from '@angular/core';
import {NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize} from "ng-zorro-antd/table";
import {Package} from "../admin/models/package";
import {ContData} from "./Models/cont-data";
import {ContServiceService} from "./Services/cont-service.service";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-conteributer',
  templateUrl: './conteributer.component.html',
  styleUrls: ['./conteributer.component.css']
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
    console.log('data :>> ', this.data);

   })
}

  getYear(date: Date): any {
    return new DatePipe('en-US').transform(date, 'y');
  }

  getMonth(date: Date): any {
    return new DatePipe('en-US').transform(date, 'M');
  }
}
