import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

import { Expense } from 'src/app/modules/receptionist/models/expense';
import { ExpenseService } from '../../services/expenses-service/expense.service';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { AddExpenseTypeComponent } from './add-expense-type/add-expense-type.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit, OnDestroy {
  @ViewChild('imageTemplate', { static: true }) imageTemplate!: TemplateRef<any>;

  userType: string | null = null;
  selectedDate: Date | null = new Date();

  tableColumns: Array<{ key: string, label: string, template?: TemplateRef<any> }> = [];
  dataSource = new MatTableDataSource<Expense>();
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  private sub = new Subscription();

  constructor(
    private dialogRef: MatDialog,
    private expenseService: ExpenseService,
    private datePipe: DatePipe,
    private authService: AuthService
  ) {
    this.userType = this.authService.userType;
  }

  ngOnInit(): void {
    this.setupColumns();
    this.getAllExpenses(0);
  }

  setupColumns(): void {
    this.tableColumns = [
      ...(this.userType === 'ROLE_ADMIN' ? [{ key: 'date', label: 'Expense Date' }] : []),
      { key: 'type', label: 'Expense Type' },
      { key: 'amount', label: 'Amount' },
      { key: 'image', label: 'Image', template: this.imageTemplate },
      { key: 'note', label: 'Note' },
      ...(this.userType === 'ROLE_ADMIN' ? [{ key: 'name', label: 'Receptionist Name' }] : [])
    ];
  }

  getAllExpenses(page: number): void {
  //console.log('Fetching expenses - page:', page, 'pageSize:', this.pageSize);
    this.expenseService.getAllExpenses(page, this.pageSize).subscribe((res: any) => {
    //console.log('Expenses response:', res);
      this.dataSource.data = [...res.data];
      this.totalItems = res.totalItems;
    });
  }

  onPageChange( event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAllExpenses(this.currentPage);
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value;
    const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    if (formattedDate) {
    //console.log('data filter', formattedDate)
      this.expenseService.filterByDate(formattedDate).subscribe((res: any) => {
      //console.log('data', res)
        this.dataSource.data = res.data;
      });
    }
  }

  clearFilter(): void {
    this.selectedDate = null;
    this.currentPage=0;
    this.getAllExpenses(0);
  }

  openDialog(which: 'expense' | 'type'): void {
    if (which === 'expense') {
      this.dialogRef.open(AddExpenseComponent);
    } else if (which === 'type') {
      this.dialogRef.open(AddExpenseTypeComponent);
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
