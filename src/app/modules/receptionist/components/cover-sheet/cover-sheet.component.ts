import { Component, OnInit } from '@angular/core';
import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize } from 'ng-zorro-antd/table';
import { CoverSheet } from 'src/app/modules/receptionist/models/cover-sheet';
import { Expense } from 'src/app/modules/receptionist/models/expense';
import { CoverSheetService } from '../../services/cover-sheet/cover-sheet.service';
import { DatePipe } from '@angular/common';
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
  selector: 'app-cover-sheet',
  templateUrl: './cover-sheet.component.html',
  styleUrls: ['./cover-sheet.component.css']
})
export class CoverSheetComponent implements OnInit {
  selectedDate: any | undefined;
  listOfData:  CoverSheet[] =[];
  displayData: readonly CoverSheet[] = [];
  allChecked = false;
  indeterminate = false;
  fixedColumn = false;
  scrollX: string | null = null;
  scrollY: string | null = null;
  settingValue: Setting;


  constructor(
    private CoverSheetService:CoverSheetService  ,  private datePipe: DatePipe){
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

  ngOnInit(): void {
    const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');

    this.CoverSheetService.getAllSheets(formattedDate).subscribe((data:any)=>{
      // console.log(data);
      this.listOfData =data;
      console.log( "data recived : " ,this.listOfData);
    })
  }

  onDateChange(event: any) {
    this.selectedDate = event.value;
    const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    this.CoverSheetService.getAllSheets(formattedDate).subscribe((data:any)=>{
      // console.log(data);
      this.listOfData =data;
      console.log( "New recived Sheet : " ,this.listOfData);
    })

  }

}
