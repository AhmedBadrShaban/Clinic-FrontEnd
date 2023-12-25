import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { ConteributerRoutingModule } from './conteributer-routing.module';
import { ConteributerComponent } from './conteributer.component';


@NgModule({
  declarations: [
    ConteributerComponent
  ],
  imports: [
    CommonModule,
    ConteributerRoutingModule,
    SharedModule
  ]
})
export class ConteributerModule { }
