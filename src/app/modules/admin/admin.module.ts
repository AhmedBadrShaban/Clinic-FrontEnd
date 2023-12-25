import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './../../shared/shared.module';
import {RouterLink} from "@angular/router";
import {NzTableModule} from "ng-zorro-antd/table";
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { DoctorComponent } from './components/doctors/doctor/doctor.component';
import { AddNewDoctorComponent } from './components/doctors/add-new-doctor/add-new-doctor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ReceptionistsComponent } from './components/receptionists/receptionists.component';
import { ReceptionistProfileComponent } from './components/receptionists/receptionist/receptionist.component';
import { ServicesComponent } from './components/services/services.component';
import { PackagesComponent } from './components/packages/packages.component';
import {NzBadgeModule} from "ng-zorro-antd/badge";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import { AddNewReceptionistComponent } from './components/receptionists/add-new-receptionist/add-new-receptionist.component';
import { AddNewPackageComponent } from './components/packages/add-new-package/add-new-package.component';
import { AddNewServiceComponent } from './components/services/add-new-service/add-new-service.component';
// import { MaterialsComponent } from './components/materials/materials.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
// import {AutoCompleteComponent} from "../shared/components/auto-complete/auto-complete.component";
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
import { MaterialsComponent } from './components/materials/materials.component';
import { AddNewMatrialComponent } from './components/materials/add-new-matrial/add-new-matrial.component';
import { AdminNavBarComponent } from './components/admin-nav-bar/admin-nav-bar.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ReceptionistModule } from '../receptionist/receptionist.module';
import { BlblComponent } from './components/admin-home/blbl/blbl.component';
import {ReportsComponent} from "../../shared/components/reports/reports.component";
import { ContributorsComponent } from './components/contributors/contributors.component';
import { AddContributorComponent } from './components/contributors/add-contributor/add-contributor.component';

@NgModule({
  declarations: [
      AdminComponent,
      DoctorsComponent,
      DoctorComponent,
      AddNewDoctorComponent,
      ReceptionistsComponent,
      ReceptionistProfileComponent,
      ServicesComponent,
      PackagesComponent,
      AddNewReceptionistComponent,
      AddNewPackageComponent,
      AddNewServiceComponent,
      ReservationsComponent,
      AdminProfileComponent,
      MaterialsComponent,
      AddNewMatrialComponent,
      BlblComponent,
      ContributorsComponent,
      AddContributorComponent,
   ],

imports: [
  CommonModule,
  AdminRoutingModule,
  AdminNavBarComponent,
  SharedModule,
  ReactiveFormsModule,
  FormsModule,
  RouterLink,
  NzTableModule,
  NzBadgeModule,
  NzDropDownModule,
  NzAutocompleteModule,
  ReceptionistModule,
  ReportsComponent
 ]
})
export class AdminModule { }
