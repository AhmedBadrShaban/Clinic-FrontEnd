import {Routes, RouterModule } from '@angular/router';
import {NgModule} from '@angular/core';
 import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './modules/login/login.component';


const routes:Routes = [
  {path : '', component:LoginComponent},
  { path: 'receptionist', loadChildren: () => import('./modules/receptionist/receptionist.module').then(m => m.ReceptionistModule) },
  { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule) },
  { path: 'doctor', loadChildren: () => import('./modules/doctor/doctor.module').then(m => m.DoctorModule) },
  {path: '**' , component: NotFoundComponent}
]
@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true } )],
    exports: [RouterModule],
 })
export class AppRoutingModule {
}
