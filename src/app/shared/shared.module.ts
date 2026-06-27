import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
 
@NgModule({
    declarations: [
 
  ],
    exports: [
     ],
    imports: [
        CommonModule,
        NavBarComponent,
         DatePickerComponent,
    ]
})
export class SharedModule { }
