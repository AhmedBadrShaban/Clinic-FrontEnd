import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatNativeDateModule} from '@angular/material/core';
import {MatButtonModule} from "@angular/material/button";
import{MatDialogModule} from "@angular/material/dialog"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SharedModule} from "./shared/shared.module";
import {NavBarComponent} from "./shared/components/nav-bar/nav-bar.component";
 import { EventsGridComponent } from './modules/rooms/events-grid/events-grid.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DatePickerComponent} from "./shared/components/date-picker/date-picker.component";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import { DialogEventComponent } from './modules/rooms/events-grid/dialog-event/dialog-event.component';
 import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import {AutoCompleteComponent} from "./shared/components/auto-complete/auto-complete.component";
 import { ReceptionistModule } from './reciptianist/receptionist.module';
import {RoomsComponent} from "./modules/rooms/rooms.component";
import {LoginComponent} from "./modules/login/login.component";
 import {RouterLink, RouterModule} from '@angular/router';
import { AdministratorRoutingModule } from './Admin/administrator-routing.module';
import { ReceptionistHomeComponent } from './reciptianist/receptionist-home/receptionist-home.component';
import {AdminNavBarComponent} from "./Admin/components/admin-nav-bar/admin-nav-bar.component";
 import {AdministratorModule} from "./Admin/administrator.module";
import {DoctorModule} from "./Doctor/doctor.module";
 import {DoctorRoutingModule} from "./Doctor/doctor-routing.module";
import { DatePipe } from '@angular/common';
import { AddNewRoomComponent } from './modules/rooms/add-new-room/add-new-room.component';
import { AvailableSlotsComponent } from './modules/rooms/available-slots/available-slots.component';
import { AddClinicComponent } from './modules/rooms/add-clinic/add-clinic.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomsComponent,
    EventsGridComponent,
    LoginComponent,
    AddNewRoomComponent,
    AvailableSlotsComponent,
    AddClinicComponent

  ],
  imports: [
    AdminNavBarComponent,
    RouterModule.forRoot([
      {path: 'Receptionist-portal', loadComponent: () => ReceptionistHomeComponent},
      {path: 'Admin-portal', loadChildren: () => AdministratorRoutingModule},
      {path: 'Doctor-portal', loadChildren: () => DoctorRoutingModule},

    ]),
    BrowserModule,
    HttpClientModule,
    NzTableModule, NzDividerModule, NzLayoutModule, NzButtonModule, NzDatePickerModule, NzFormModule,
    FormsModule,
    DatePipe,
    ReactiveFormsModule,
    ReceptionistModule,
    MatButtonModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatDialogModule,
    SharedModule,
    NavBarComponent,
    BrowserAnimationsModule,
    DatePickerComponent,
    NzTabsModule,
    DialogEventComponent,
    NzPaginationModule,
    NzSelectModule,
    AutoCompleteComponent,
    RouterLink,
    AdministratorModule, DoctorModule

  ],
  exports:[
    // ExpenseComponent,

  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
