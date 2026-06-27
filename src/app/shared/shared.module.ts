import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { ReportsComponent } from './components/reports/reports.component';

@NgModule({
    declarations: [
 
  ],
    exports: [
      ReportsComponent,
    ],
    imports: [
        CommonModule,
        NavBarComponent,
        ReportsComponent,
        DatePickerComponent,
    ]
})
export class SharedModule { }
