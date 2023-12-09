import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {AdminHomeComponent} from "./admin-home/admin-home.component";
import {RoomsComponent} from "../modules/rooms/rooms.component";
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
 import {DoctorsComponent} from "./components/doctors/doctors.component";
import {DoctorComponent} from "./components/doctors/doctor/doctor.component";
import {ReceptionistsComponent} from "./components/receptionists/receptionists.component";
import {ReceptionistComponent} from "./components/receptionists/receptionist/receptionist.component";
import {ServicesComponent} from "./components/services/services.component";
import {PackagesComponent} from "./components/packages/packages.component";
import {MaterialsComponent} from "./components/materials/materials.component";
import {ReservationsComponent} from "./components/reservations/reservations.component";
import { ReservationComponent } from '../reciptianist/components/reservation/reservation.component';

const routes: Routes = [
  {path: '', component: AdminHomeComponent },
  {path: 'AdminProfile', component: AdminProfileComponent },
  {path: 'rooms', component: RoomsComponent },
  {path: 'patients', component: ReservationComponent},
  {path: 'doctors', component: DoctorsComponent},
  {path: 'doctor/:id', component: DoctorComponent},
  {path: 'receptionists', component: ReceptionistsComponent},
  {path: 'Areceptionist/:id', component: ReceptionistComponent},
  {path: 'services', component: ServicesComponent},
  {path: 'packages', component: PackagesComponent},
  {path: 'materials', component: MaterialsComponent},
  {path: 'reservations', component: ReservationsComponent},
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AdministratorRoutingModule {
}
