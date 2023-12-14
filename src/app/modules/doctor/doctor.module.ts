import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorRoutingModule } from './doctor-routing.module';
import { DoctorComponent } from './doctor.component';
import { DoctorNavBarComponent } from './components/doctor-nav-bar/doctor-nav-bar.component';
import {NzTableModule} from "ng-zorro-antd/table";
// import { ReservationHomePageComponent } from './Components/reservation-home-page/reservation-home-page.component';
import {NzTabsModule} from "ng-zorro-antd/tabs";
 import { ReactiveFormsModule } from '@angular/forms';
import { ReceptionistModule } from '../receptionist/receptionist.module';
import { DoctorProfileComponent } from './components/doctor-profile/doctor-profile.component';
import { MainPageComponent } from './main-page/main-page.component';



@NgModule({
  declarations: [
    DoctorComponent,
    DoctorNavBarComponent,
    DoctorProfileComponent,
    MainPageComponent,
  ],
  exports:[DoctorNavBarComponent , MainPageComponent],
  imports: [
    CommonModule,
    DoctorRoutingModule,
    ReactiveFormsModule,
    NzTableModule,
    NzTabsModule,
    ReceptionistModule
  ]
})
export class DoctorModule { }
