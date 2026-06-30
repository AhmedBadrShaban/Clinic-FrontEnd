import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  exact?: boolean;
}

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  isCollapsed = false;
  mobileOpen = false;
  currentPageTitle = 'Receptionist';

  @Output() isCollapsedChange = new EventEmitter<boolean>();

  navItems: NavItem[] = [
    { label: 'Add New Patient',  icon: 'bi-person-plus',   route: 'addpatient' },
    { label: 'Rooms',            icon: 'bi-door-open',     route: 'rooms' },
    { label: 'Doctor Schedule',  icon: 'bi-calendar3',     route: 'doctorscedule' },
    { label: 'Reservation',      icon: 'bi-journal-check', route: 'reservation' },
    { label: 'Expense',          icon: 'bi-receipt',       route: 'expense' },
    { label: 'Package',          icon: 'bi-box-seam',      route: 'package' },
    { label: 'Daily Sheet',      icon: 'bi-file-text',     route: 'dailysheet' },
    { label: 'Cover Sheet',      icon: 'bi-file-earmark',  route: 'coversheet' },
  ];

  constructor(private authService: AuthService, private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle();
        this.mobileOpen = false;
      });
    this.updatePageTitle();
  }

  private updatePageTitle(): void {
    const url = this.router.url;
    const matched = this.navItems.find(item => url.includes(item.route));
    this.currentPageTitle = matched?.label ?? 'Receptionist';
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.isCollapsedChange.emit(this.isCollapsed);
    this.cd.markForCheck();
  }

  closeMobile(): void {
    this.mobileOpen = false;
    this.cd.markForCheck();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}