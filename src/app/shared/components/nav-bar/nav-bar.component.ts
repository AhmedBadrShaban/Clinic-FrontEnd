import {Component, NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  standalone:true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgOptimizedImage]
})
export class NavBarComponent {

}
