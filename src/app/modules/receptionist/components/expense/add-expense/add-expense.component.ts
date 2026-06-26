import { ExpenseService } from './../../../services/expenses-service/expense.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Expense } from 'src/app/modules/receptionist/models/expense';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-add-expense',
    templateUrl: './add-expense.component.html',
    styleUrls: ['./add-expense.component.css'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgFor, NgIf]
})
export class AddExpenseComponent implements OnInit{
  expenseFm: FormGroup;
  types:string[];
  selectedFileName: string;
  flag:boolean=false;

  constructor(private fb: FormBuilder,@Inject(MAT_DIALOG_DATA) public data:Expense ,public dialogRef: MatDialogRef<AddExpenseComponent> , private expenseService:ExpenseService) {

    this.expenseFm = fb.group({
      amount: ['', [Validators.required]],
      type: ['default', [Validators.required]],
      note: ['', []],
      image: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.expenseService.getAllExpensesTypes().subscribe((data)=>{
      this.types = data;
      this.types.push('other');
      //console.log('Recived types :>> ',this.types);
    })
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFileName = file.name;
    this.flag=true;
  }

  // handleFileChange(event: any) {
  //   const fileInput = event.target;
  //   const selectedFile = fileInput.files[0];
  //   this.selectedFileName = selectedFile ? selectedFile.name : 'Choose File';
  // }
  handleFileChange(event: any) {
    const selectedFile = event.target.files[0];
    this.selectedFileName = selectedFile ? selectedFile.name : undefined;
    this.expenseFm.get('file')?.setValue(selectedFile);
  }

  submit() {
    let userModel:Expense=this.expenseFm.value as Expense;
    //console.log( "form data before sending request",userModel);
    this.expenseService.addNewExpense(userModel).subscribe({
      next:(data:any)=>{
        alert(data.message);
        this.closeDialog();
        this.UpdateAllExpenses();
      },
      error:(err)=>{
        //console.log("error in editing: ", err);
      }
    })
  }
  UpdateAllExpenses(){
    this.expenseService.getAllExpenses().subscribe((data:any)=>{
          this.expenseService.updateListOfData(data);
          //console.log( "data Updated : " ,data);
        })
  }
  closeDialog() {
    this.dialogRef.close();
  }

}
