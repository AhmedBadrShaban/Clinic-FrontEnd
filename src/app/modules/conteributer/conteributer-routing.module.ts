import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConteributerComponent } from './conteributer.component';

const routes: Routes = [{ path: '', component: ConteributerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConteributerRoutingModule { }
