import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Expense } from 'src/app/reciptianist/models/expense';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize } from 'ng-zorro-antd/table';
import { ExpenseService } from '../../services/expenses-service/expense.service';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/modules/Services/Login-Services/login.service';
import { AddExpenseTypeComponent } from './add-expense-type/add-expense-type.component';

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
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  userType:any;
  selectedDate: any | undefined;
  listOfData: readonly Expense[] =[];
  displayData: readonly Expense[] = [];
  allChecked = false;
  indeterminate = false;
  fixedColumn = false;
  scrollX: string | null = null;
  scrollY: string | null = null;
  settingValue: Setting;



  constructor(private dialogRef : MatDialog  ,
    private ExpenseService:ExpenseService , private datePipe:DatePipe , private loggedIn:LoginService ){
      this.userType = loggedIn.userType;
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
    this.getAllExpenses();
    // Listing for any Updates in Data
    this.ExpenseService.listOfData$.subscribe((data: readonly any[]) => {
      this.listOfData = data;
    });
  }
  getAllExpenses(){
  this.ExpenseService.getAllExpenses().subscribe((data:any)=>{
    this.listOfData =data;
   console.log( "data recived : " ,this.listOfData);
 })
}
  onDateChange(event: any) {
    this.selectedDate = event.value;
    const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    this.ExpenseService.filterByDate(formattedDate).subscribe((data:any)=>{
      // console.log(data);
      this.listOfData =data;
      console.log( "Search result is  : " ,this.listOfData);
    })
  }
  clearFilter(){
    this.selectedDate = null;
    this.getAllExpenses();
  }
  openDialog(which:string){
    if(which=='expense'){
    this.dialogRef.open(AddExpenseComponent);
    }
    else if(which=='type'){
      this.dialogRef.open(AddExpenseTypeComponent);
    }
  }
}
