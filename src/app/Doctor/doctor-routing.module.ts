import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainPageComponent} from "./main-page/main-page.component";
import { DoctorProfileComponent } from './components/doctor-profile/doctor-profile.component';
 const routes: Routes = [
  {path: '' , component: MainPageComponent},
  {path: 'doctorProfile', component:  DoctorProfileComponent},
  // {path: 'afterWork', component:  AfterWorkComponent},
  // {path: 'Dreservation/:id', component:  ReservationHomePageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule { }
