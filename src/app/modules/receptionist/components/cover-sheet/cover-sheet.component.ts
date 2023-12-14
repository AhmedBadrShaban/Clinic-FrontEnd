import { Component, OnInit } from '@angular/core';
import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize } from 'ng-zorro-antd/table';
import { CoverSheet } from 'src/app/modules/receptionist/models/cover-sheet';
import { Expense } from 'src/app/modules/receptionist/models/expense';
import { CoverSheetService } from '../../services/cover-sheet/cover-sheet.service';
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
  listOfData: readonly CoverSheet[] =[];
  displayData: readonly CoverSheet[] = [];
  allChecked = false;
  indeterminate = false;
  fixedColumn = false;
  scrollX: string | null = null;
  scrollY: string | null = null;
  settingValue: Setting;


  constructor(
    private CoverSheetService:CoverSheetService ){
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
    this.CoverSheetService.getAllSheets().subscribe((data:any)=>{
      // console.log(data);
      this.listOfData =data;
      console.log( "data recived : " ,this.listOfData);
    })
  }

}
