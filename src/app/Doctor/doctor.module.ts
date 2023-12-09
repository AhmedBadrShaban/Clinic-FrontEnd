import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorRoutingModule } from './doctor-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { DoctorNavBarComponent } from './components/doctor-nav-bar/doctor-nav-bar.component';

import { DoctorProfileComponent } from './components/doctor-profile/doctor-profile.component';
import {NzTableModule} from "ng-zorro-antd/table";
import { ReservationHomePageComponent } from './Components/reservation-home-page/reservation-home-page.component';
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {ReceptionistModule} from "../reciptianist/receptionist.module";
import { AfterWorkComponent } from './components/after-work/after-work.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MainPageComponent,
    DoctorNavBarComponent,

    DoctorProfileComponent,
    ReservationHomePageComponent,
    AfterWorkComponent
  ],
  exports: [
    DoctorNavBarComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DoctorRoutingModule,
    NzTableModule,
    NzTabsModule,
    ReceptionistModule
  ]
})
export class DoctorModule { }
