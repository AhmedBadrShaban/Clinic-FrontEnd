import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
 import { AppComponent } from './app.component';
 // import { AppRoutingModule } from './app-routing.module';
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
// import { AddPatientComponent } from './components/expense/add-patient/add-patient.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import {AutoCompleteComponent} from "./shared/components/auto-complete/auto-complete.component";
 import { ReceptionistModule } from './reciptianist/receptionist.module';
import {RoomsComponent} from "./modules/rooms/rooms.component";
import {LoginComponent} from "./modules/login/login.component";
import { ReceptionistRoutingModule } from './reciptianist/receptionist-routing.module';
import {RouterLink, RouterModule} from '@angular/router';
import { AdministratorRoutingModule } from './Admin/administrator-routing.module';
import { ReceptionistHomeComponent } from './reciptianist/receptionist-home/receptionist-home.component';
import {AdminNavBarComponent} from "./Admin/components/admin-nav-bar/admin-nav-bar.component";
import {AdminHomeComponent} from "./Admin/admin-home/admin-home.component";
 import {AdministratorModule} from "./Admin/administrator.module";
import {DoctorsComponent} from "./Admin/components/doctors/doctors.component";
import {DoctorComponent} from "./Admin/components/doctors/doctor/doctor.component";
import {ReceptionistsComponent} from "./Admin/components/receptionists/receptionists.component";
import {ReceptionistComponent} from "./Admin/components/receptionists/receptionist/receptionist.component";
import {ServicesComponent} from "./Admin/components/services/services.component";
import {PackagesComponent} from "./Admin/components/packages/packages.component";
import {MaterialsComponent} from "./Admin/components/materials/materials.component";
import {ReservationsComponent} from "./Admin/components/reservations/reservations.component";
import {DoctorModule} from "./Doctor/doctor.module";
import {MainPageComponent} from "./Doctor/main-page/main-page.component";
import {DoctorRoutingModule} from "./Doctor/doctor-routing.module";
import { DatePipe } from '@angular/common';
import { AddNewRoomComponent } from './modules/rooms/add-new-room/add-new-room.component';
import { AvailableSlotsComponent } from './modules/rooms/available-slots/available-slots.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomsComponent,
    EventsGridComponent,
    LoginComponent,
    AddNewRoomComponent,
    AvailableSlotsComponent

  ],
  imports: [
    AdminNavBarComponent,
    RouterModule.forRoot([
      {path: 'Receptionist-portal', loadChildren: () => ReceptionistHomeComponent},
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
