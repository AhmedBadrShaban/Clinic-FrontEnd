 import { DailySheet } from 'src/app/modules/receptionist/models/daily-sheet';
import { DailysheetService } from './../../services/dailySheet-service/dailysheet.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize } from 'ng-zorro-antd/table';
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
  selector: 'app-daily-sheet',
  templateUrl: './daily-sheet.component.html',
  styleUrls: ['./daily-sheet.component.css']
})
export class DailySheetComponent {
  selectedRoom: string;
  selectedReciptianist: string;
  selectedDate: any;
  dailyInfo: readonly DailySheet[] =[];
  displayData: readonly DailySheet[] = [];
  allChecked = false;
  indeterminate = false;
  fixedColumn = false;
  scrollX: string | null = null;
  scrollY: string | null = null;
  settingValue: Setting;





  constructor(private dailySheetService:DailysheetService , private datePipe:DatePipe ){
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
    this.dailySheetService.getAllDailyInfo().subscribe((data:any)=>{
      // console.log(data);
      this.dailyInfo =data;
      console.log( "daily sheet recived : " ,this.dailyInfo);
    })}

    onRoomChange(){
      // console.log("executing Room Filtering");
      console.log("selected room before filtring is : " , this.selectedRoom)
      this.dailySheetService.filterDailySheet(this.selectedRoom , this.selectedDate , this.selectedReciptianist).subscribe((data:any)=>{
          console.log(data);
          this.dailyInfo =data;
          console.log( "Search result is  : " ,this.dailyInfo);
        })
    }
    onDoctorChange(){
      // console.log("executing Doctor Filtering");
      console.log("selected Doctor before filtring is : " , this.selectedReciptianist)
      this.dailySheetService.filterDailySheet(this.selectedRoom , this.selectedDate , this.selectedReciptianist).subscribe((data:any)=>{
          console.log(data);
          this.dailyInfo =data;
          console.log( "Search result is  : " ,this.dailyInfo);
        })
    }
     onDateChange(event: any){
      const formattedDate = event.value;
      this.selectedDate= this.datePipe.transform(formattedDate, 'yyyy-MM-dd');
      console.log("executing Date Filtering");
      console.log("selected Date before filtring is : " ,this.selectedDate)
      this.dailySheetService.filterDailySheet(this.selectedRoom , this.selectedDate , this.selectedReciptianist).subscribe((data:any)=>{
          console.log(data);
          this.dailyInfo =data;
          console.log( "Search result is : " ,this.dailyInfo);
        })
    }
    clearFilter() {
      console.log('Clearing Filters ');

      // Reset the selectedRoom and selectedReciptianist to their default values
      this.selectedDate = null;
      this.selectedRoom = "Room";
      this.selectedReciptianist = "Reciptianist";

      // Call the filterDailySheet method
      this.dailySheetService.filterDailySheet().subscribe((data: any) => {
          console.log(data);
          this.dailyInfo = data;
          console.log("Search result is : ", this.dailyInfo);
      });
  }

}
