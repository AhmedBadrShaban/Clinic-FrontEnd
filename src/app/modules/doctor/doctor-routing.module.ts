import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorComponent } from './doctor.component';
import { DoctorProfileComponent } from './components/doctor-profile/doctor-profile.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ReservationComponent } from '../receptionist/components/reservation/reservation.component';

const routes: Routes = [{ path: '', component: DoctorComponent ,
children:[
  {path: '', component: MainPageComponent},
  {path: 'doctorProfile', component:  DoctorProfileComponent},
  {path:"reservation",component:ReservationComponent},
  //  {path: 'afterWork', component:  AfterWorkComponent},
  // {path: 'Dreservation/:id', component:  ReservationHomePageComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule { }
