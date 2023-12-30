import {Routes, RouterModule } from '@angular/router';
import {NgModule} from '@angular/core';
 import { NotFoundComponent } from './not-found/not-found.component';
 import { LoginComponent } from './modules/login/login.component';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { ForbiddenComponent } from './forbidden/forbidden.component';



const routes:Routes = [
  {path : '', component:LoginComponent},
  {path : 'login' , component:LoginComponent},
  { path: 'receptionist', loadChildren:
  () => import('./modules/receptionist/receptionist.module').then(m => m.ReceptionistModule),
  canActivate: [AuthGuardService],
  data: { requiredRole: 'ROLE_RECEPTIONIST' }
},

  { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule) ,
    canActivate: [AuthGuardService],
    data: { requiredRole: 'ROLE_ADMIN' }
},
  { path: 'doctor', loadChildren: () => import('./modules/doctor/doctor.module').then(m => m.DoctorModule),
    canActivate: [AuthGuardService],
    data: { requiredRole: 'ROLE_DOCTOR' }
},
{ path: 'forbidden', component: ForbiddenComponent },
  { path: 'contributer', loadChildren: () => import('./modules/conteributer/conteributer.module').then(m => m.ConteributerModule), 
  canActivate: [AuthGuardService],
  data: { requiredRole:  'ROLE_CONTRIBUTOR'} 
},
  {path: '**' , component: NotFoundComponent}
]
@NgModule({
  imports: [RouterModule.forRoot(routes )],
    exports: [RouterModule],
 })
export class AppRoutingModule {
}
