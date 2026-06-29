import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { filter } from 'rxjs/operators';

export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  exact?: boolean;
  children?: NavItem[];
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
  mobileOpen = false;
  currentPageTitle = 'Dashboard';

  @Output() isCollapsedChange = new EventEmitter<boolean>();

  navItems: NavItem[] = [
    { label: 'Dashboard',        icon: 'bi-grid-1x2',         route: '/admin', exact: true },
    {
      label: 'Reports', icon: 'bi-bar-chart-line',
      children: [
        { label: 'Monthly Income',     icon: 'bi-graph-up-arrow',  route: '/admin/reports/monthly-income' },
        { label: 'Outstanding Debit',  icon: 'bi-wallet2',         route: '/admin/reports/debit-report' },
        { label: 'Debit Movements',    icon: 'bi-arrow-left-right', route: '/admin/reports/debit-movements' },
        { label: 'WhatsApp Messages',  icon: 'bi-whatsapp',        route: '/admin/reports/whatsapp-messages' },
      ]
    },
    { label: 'Rooms',            icon: 'bi-door-open',        route: '/admin/rooms' },
    { label: 'Patients',         icon: 'bi-people',           route: '/admin/patients' },
    { label: 'Receptionists',    icon: 'bi-headset',          route: '/admin/receptionists' },
    { label: 'Doctors',          icon: 'bi-person-badge',     route: '/admin/doctors' },
    { label: 'Doctor Schedule',  icon: 'bi-calendar3',        route: '/admin/doctor-schedular' },
    { label: 'Services',         icon: 'bi-stars',            route: '/admin/services' },
    { label: 'Packages',         icon: 'bi-box-seam',         route: '/admin/admin-package' },
    { label: 'Reserved Packages',icon: 'bi-bookmark-check',   route: '/admin/reserved-packages' },
    { label: 'Materials',        icon: 'bi-droplet',          route: '/admin/materials' },
    { label: 'Expenses',         icon: 'bi-receipt',          route: '/admin/expense' },
    { label: 'Contributors',     icon: 'bi-person-lines-fill', route: '/admin/contributors' },
  ];

  openGroups: Record<string, boolean> = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle();
        this.syncOpenGroups();
        // Auto-close drawer on navigation (mobile)
        this.mobileOpen = false;
      });

    this.updatePageTitle();
    this.syncOpenGroups();
  }

  private updatePageTitle(): void {
    const url = this.router.url;

    for (const item of this.navItems) {
      if (item.children) {
        const matchedChild = item.children.find(c => c.route && url.startsWith(c.route));
        if (matchedChild) {
          this.currentPageTitle = matchedChild.label;
          return;
        }
      }
    }

    const matched = this.navItems.find(item =>
      item.route && (item.exact ? url === item.route : url.startsWith(item.route))
    );
    this.currentPageTitle = matched?.label ?? 'Admin';
  }

  private syncOpenGroups(): void {
    const url = this.router.url;
    this.navItems.forEach(item => {
      if (item.children) {
        const anyChildActive = item.children.some(c => c.route && url.startsWith(c.route));
        if (anyChildActive) {
          this.openGroups[item.label] = true;
        }
      }
    });
  }

  toggleGroup(item: NavItem): void {
    if (!this.isCollapsed) {
      this.openGroups[item.label] = !this.openGroups[item.label];
    }
  }

  isGroupOpen(item: NavItem): boolean {
    return !!this.openGroups[item.label];
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