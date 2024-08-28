 import { DailySheet, DailySheetStatus } from 'src/app/modules/receptionist/models/daily-sheet';
import { DailysheetService } from './../../services/dailySheet-service/dailysheet.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize } from 'ng-zorro-antd/table';
 import { DatePipe } from '@angular/common';
import { RoomsService } from 'src/app/modules/Services/rooms/rooms.service';

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
  allRooms:any [];
  allDoctors:string[];
  selectedRoom: string;
  selectedDoctor: any;
  selectedDate: any;
  dailyInfo: readonly DailySheet[] =[];
  dailySheetStatus: DailySheetStatus;
  displayData: readonly DailySheet[] = [];
  allChecked = false;
  indeterminate = false;
  fixedColumn = false;
  scrollX: string | null = null;
  scrollY: string | null = null;
  settingValue: Setting;





  constructor(private dailySheetService:DailysheetService , private roomsService:RoomsService ,private datePipe:DatePipe ){
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
      position: 'bottom' as NzTablePaginationPosition
    };
   }

  ngOnInit(): void {
    this.selectedDate= this.datePipe.transform(this.selectedDate , 'yyyy-MM-dd');

    this.dailySheetService.filterDailySheet( undefined , this.selectedDate ).subscribe((data:any)=>{
      // ////console.log(data);
      this.dailyInfo = data[0].dailySheets;
      this.dailySheetStatus = data[1];
      //console.log( "daily sheet recived : " ,this.dailyInfo);
    })
    this.roomsService.allRooms().subscribe((rooms)=>{
      this.allRooms =rooms;
      //console.log('rooms :>> ', this.allRooms);
    })
    this.dailySheetService.getAllDoctorsNames().subscribe((data:any)=>{
      this.allDoctors =data;
      //console.log('AllNames of Doctors:>> ', this.allDoctors);
     })
  }

    onRoomChange(){
      // //console.log("executing Room Filtering");
      //console.log("selected room before filtring is : " , this.selectedRoom)
      this.dailySheetService.filterDailySheet(this.selectedRoom , this.selectedDate , this.selectedDoctor).subscribe((data:any)=>{
          //console.log(data);
          this.dailyInfo = data[0].dailySheets;
          this.dailySheetStatus = data[1];
          //console.log( "Search result is  : " ,this.dailyInfo);
        })
    }
    onDoctorChange(){
      // //console.log("executing Doctor Filtering");
      //console.log("selected Doctor before filtring is : " , this.selectedDoctor)
      this.dailySheetService.filterDailySheet(this.selectedRoom , this.selectedDate , this.selectedDoctor).subscribe((data:any)=>{
          //console.log(data);
          this.dailyInfo = data[0].dailySheets;
          this.dailySheetStatus = data[1];

          //console.log( "Search result is  : " ,this.dailyInfo);
        })
    }
     onDateChange(event: any){
      const formattedDate = event.value;
      this.selectedDate= this.datePipe.transform(formattedDate, 'yyyy-MM-dd');
      //console.log("executing Date Filtering");
      //console.log("selected Date before filtring is : " ,this.selectedDate)
      this.dailySheetService.filterDailySheet(this.selectedRoom , this.selectedDate , this.selectedDoctor).subscribe((data:any)=>{
          //console.log(data);
          this.dailyInfo = data[0].dailySheets;
          this.dailySheetStatus = data[1];
          //console.log( "Search result is : " ,this.dailyInfo);
        })
    }
    clearFilter() {
      //console.log('Clearing Filters ');

      // Reset the selectedRoom and selectedReciptianist to their default values
      this.selectedDate = null;
      this.selectedRoom = "Room";
      this.selectedDoctor = null;

      // Call the filterDailySheet method
      this.dailySheetService.filterDailySheet().subscribe((data: any) => {
          //console.log(data);
          this.dailyInfo = data[0].dailySheets;
          this.dailySheetStatus = data[1];
          //console.log("Search result is : ", this.dailyInfo);
      });
  }

}
