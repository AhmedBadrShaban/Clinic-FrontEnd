import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { ConteributerRoutingModule } from './conteributer-routing.module';
import { ConteributerComponent } from './conteributer.component';
import { AdminNavBarComponent } from '../admin/components/admin-nav-bar/admin-nav-bar.component';


@NgModule({
  declarations: [
    ConteributerComponent
    
  ],
  imports: [
    CommonModule,
    ConteributerRoutingModule,
    SharedModule,
    AdminNavBarComponent
  ]
})
export class ConteributerModule { }
