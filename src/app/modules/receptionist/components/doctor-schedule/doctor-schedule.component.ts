import { DatePipe } from '@angular/common';
import { DoctorScheduleServiceService } from './../../services/doctor-schedule-service/doctor-schedule-service.service';
import {Component, OnInit} from '@angular/core';
import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize } from 'ng-zorro-antd/table';
import { MatDialog } from '@angular/material/dialog';
import { PopUpFormComponent } from './pop-up-form/pop-up-form.component';
import {scheduleData} from '../../models/doctor.schedule.model'
import { ReservationfmService } from '../../services/Reservation_Form/reservationfm.service';


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
  selector: 'app-doctor-schedule',
  templateUrl: './doctor-schedule.component.html',
  styleUrls: ['./doctor-schedule.component.css']
})


export class DoctorScheduleComponent implements OnInit {
  selectedDate: Date;
  listOfData: readonly scheduleData[] =[];
  displayData: readonly scheduleData[] = [];
  searchValue:string;
  allChecked = false;
  indeterminate = false;
  fixedColumn = false;
  scrollX: string | null = null;
  scrollY: string | null = null;
  settingValue: Setting;

  openDialog(dataa:any){
    this.dialogRef.open(PopUpFormComponent , {
      data:dataa
    })
    // console.log("sended data is : " , dataa )
  }

  constructor(private dialogRef : MatDialog , private datePipe: DatePipe,  private DoctorScheduleService:DoctorScheduleServiceService){
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
    this.getAllSchedules();
      // Subscribe to the Observable to update listOfData when changes occur
  this.DoctorScheduleService.listOfData$.subscribe((data: readonly any[]) => {
    this.listOfData = data;
  });
    }
    getAllSchedules(){
      const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');

      this.DoctorScheduleService.filterByDate(formattedDate).subscribe((data:any)=>{
        // console.log(data);
        this.listOfData =data;
        console.log( "data recived : " ,this.listOfData);
      })
    }
    changeConfirmStatus(scheduleId: number , data:any) {
      // data.confirmed = !data.confirmed;
       this.DoctorScheduleService.changeScheduleStatus(scheduleId).subscribe({
        next: (data) => {
          alert(data.message)
          this.getAllSchedules();
          },
        error: (err) => {
          alert(err.error.message)
         }
      });
    }
    search(key:string){
      console.log("executing Search");
    this.DoctorScheduleService.Search(key).subscribe((data:any)=>{
        // console.log(data);
        this.listOfData =data;
        console.log( "Search result is  : " ,this.listOfData);
      })
    }
    onDateChange(event: any) {
      this.selectedDate = event.value;
      const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
      this.DoctorScheduleService.filterByDate(formattedDate).subscribe((data:any)=>{
        // console.log(data);
        this.listOfData =data;
        console.log( "Search result is  : " ,this.listOfData);
      })

    }

}
