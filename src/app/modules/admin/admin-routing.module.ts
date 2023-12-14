import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ReservationComponent } from '../receptionist/components/reservation/reservation.component';
import { ReceptionistComponent } from '../receptionist/receptionist.component';
import { RoomsComponent } from '../rooms/rooms.component';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
import { DoctorComponent } from './components/doctors/doctor/doctor.component';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { MaterialsComponent } from './components/materials/materials.component';
import { ReceptionistsComponent } from './components/receptionists/receptionists.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { ServicesComponent } from './components/services/services.component';
import { PackagesComponent } from './components/packages/packages.component';
import { ExpenseComponent } from '../receptionist/components/expense/expense.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
 
const routes: Routes = [
    { path: '', component: AdminComponent, children:[
      {path: '', component: AdminHomeComponent},
      {path: 'adminProfile', component: AdminProfileComponent },
      {path: 'rooms', component: RoomsComponent, pathMatch:'full',},
      {path: 'expense', component: ExpenseComponent, pathMatch:'full'},
      {path: 'patients', component: ReservationComponent},
      {path: 'doctors', component: DoctorsComponent},
      {path: 'doctor/:id', component: DoctorComponent},
      {path: 'receptionists', component: ReceptionistsComponent},
      {path: 'Areceptionist/:id', component: ReceptionistComponent},
      {path: 'services', component: ServicesComponent},
      {path: 'admin-package', component: PackagesComponent, pathMatch:'full'},
      {path: 'materials', component: MaterialsComponent},
      {path: 'reservations', component: ReservationsComponent},
    ]},
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
