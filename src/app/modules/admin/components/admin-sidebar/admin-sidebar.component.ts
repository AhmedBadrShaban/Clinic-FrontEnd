import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { filter } from 'rxjs/operators';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {
  isCollapsed = false;
  currentPageTitle = 'Dashboard';

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/admin', icon: 'bi-grid-1x2' },
    { label: 'Rooms', route: '/admin/rooms', icon: 'bi-door-open' },
    { label: 'Patients', route: '/admin/patients', icon: 'bi-people' },
    { label: 'Doctors', route: '/admin/doctors', icon: 'bi-person-badge' },
    { label: 'Doctor Schedule', route: '/admin/doctor-schedular', icon: 'bi-calendar3' },
    { label: 'Receptionists', route: '/admin/receptionists', icon: 'bi-headset' },
    { label: 'Services', route: '/admin/services', icon: 'bi-stars' },
    { label: 'Packages', route: '/admin/admin-package', icon: 'bi-box-seam' },
    { label: 'Reserved Packages', route: '/admin/reserved-packages', icon: 'bi-bookmark-check' },
    { label: 'Materials', route: '/admin/materials', icon: 'bi-droplet' },
    { label: 'Expenses', route: '/admin/expense', icon: 'bi-receipt' },
    { label: 'Monthly Income', route: '/admin/monthly-income', icon: 'bi-graph-up-arrow' },
    { label: 'Contributors', route: '/admin/contributors', icon: 'bi-person-lines-fill' },
  ];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const matched = this.navItems.find(item =>
          item.route !== '/admin' && this.router.url.startsWith(item.route)
        ) || (this.router.url === '/admin' ? this.navItems[0] : null);
        this.currentPageTitle = matched?.label ?? 'Admin';
      });
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}