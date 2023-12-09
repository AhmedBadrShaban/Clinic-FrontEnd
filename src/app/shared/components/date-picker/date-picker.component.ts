import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, FormsModule, MatButtonModule],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit{
  @Output() dateSelected = new EventEmitter<Date>();
  selectedDate: Date|undefined ;
  onDateSelected() {
    this.dateSelected.emit(this.selectedDate);
  }

  ngOnInit(): void {
    this.selectedDate = new Date();
    this.onDateSelected();
  }

}
