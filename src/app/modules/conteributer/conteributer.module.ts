import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { ConteributerRoutingModule } from './conteributer-routing.module';
import { ConteributerComponent } from './conteributer.component';
import {NzAutocompleteModule} from "ng-zorro-antd/auto-complete";
import {NzTableModule} from "ng-zorro-antd/table";
import {ReactiveFormsModule} from "@angular/forms";
import { NavBarContComponent } from './Components/nav-bar-cont/nav-bar-cont.component';


@NgModule({
  declarations: [
    ConteributerComponent,
    NavBarContComponent
  ],
    imports: [
        CommonModule,
        ConteributerRoutingModule,
        SharedModule,
        NzAutocompleteModule,
        NzTableModule,
        ReactiveFormsModule
    ]
 })
export class ConteributerModule { }
