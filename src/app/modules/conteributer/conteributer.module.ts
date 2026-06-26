import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConteributerRoutingModule } from './conteributer-routing.module';
import { ConteributerComponent } from './conteributer.component';
import {NzAutocompleteModule} from "ng-zorro-antd/auto-complete";
import {NzTableModule} from "ng-zorro-antd/table";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NavBarContComponent } from './Components/nav-bar-cont/nav-bar-cont.component';


@NgModule({
    imports: [
    CommonModule,
    ConteributerRoutingModule,
    NzAutocompleteModule,
    NzTableModule,
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule,
    ConteributerComponent,
    NavBarContComponent
]
})
export class ConteributerModule { }
