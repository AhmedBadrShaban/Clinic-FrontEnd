import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { filter } from 'rxjs/operators';

export interface NavItem {
  label: string;
  icon: string;
  description?: string;
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

  /* ── current page metadata, driven by navItems, consumed by the shared topbar ── */
  currentPageTitle = 'Dashboard';
  currentPageIcon = 'bi-grid-1x2';
  currentPageDescription = '';

  @Output() isCollapsedChange = new EventEmitter<boolean>();

  navItems: NavItem[] = [
    {
      label: 'Dashboard', icon: 'bi-grid-1x2', route: '/admin', exact: true,
      description: 'Overview of today\'s clinic activity'
    },
    {
      label: 'Reports', icon: 'bi-bar-chart-line',
      children: [
        {
          label: 'Monthly Income Report', icon: 'bi-graph-up-arrow', route: '/admin/reports/monthly-income',
          description: 'Generate detailed income reports by room or packages'
        },
        {
          label: 'Outstanding Debit Report', icon: 'bi-wallet2', route: '/admin/reports/debit-report',
          description: 'Patients with unpaid balances'
        },
        {
          label: 'Debit Movements Report', icon: 'bi-arrow-left-right', route: '/admin/reports/debit-movements',
          description: 'Full history of debit changes across all patients'
        },

        {
          label: 'Package Movements Report', icon: 'bi-box-seam', route: '/admin/reports/package-movements',
          description: 'Full audit trail of package changes — reserve, checkout deductions, manual edits, removals'
        },
        {
          label: 'WhatsApp Messages Report', icon: 'bi-whatsapp', route: '/admin/reports/whatsapp-messages',
          description: 'Delivery status of automated messages'
        },
      ]
    },
    { label: 'Rooms', icon: 'bi-door-open', route: '/admin/rooms' },
    { label: 'Patients', icon: 'bi-people', route: '/admin/patients' },
    { label: 'Receptionists', icon: 'bi-headset', route: '/admin/receptionists' },
    { label: 'Doctors', icon: 'bi-person-badge', route: '/admin/doctors' },
    { label: 'Doctor Schedule', icon: 'bi-calendar3', route: '/admin/doctor-schedular' },
    { label: 'Services', icon: 'bi-stars', route: '/admin/services' },
    { label: 'Packages', icon: 'bi-box-seam', route: '/admin/admin-package' },
    { label: 'Reserved Packages', icon: 'bi-bookmark-check', route: '/admin/reserved-packages' },
    { label: 'Promotions', icon: 'bi-percent', route: '/admin/promotions' }, { label: 'Materials', icon: 'bi-droplet', route: '/admin/materials' },
    { label: 'Expenses', icon: 'bi-receipt', route: '/admin/expense' },
    { label: 'Contributors', icon: 'bi-person-lines-fill', route: '/admin/contributors' },
  ];

  openGroups: Record<string, boolean> = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.updateCurrentPage();
        this.syncOpenGroups();
        // Auto-close drawer on navigation (mobile)
        this.mobileOpen = false;
      });

    this.updateCurrentPage();
    this.syncOpenGroups();
  }

  private updateCurrentPage(): void {
    const url = this.router.url;

    for (const item of this.navItems) {
      if (item.children) {
        const matchedChild = item.children.find(c => c.route && url.startsWith(c.route));
        if (matchedChild) {
          this.setCurrentPage(matchedChild);
          return;
        }
      }
    }

    const matched = this.navItems.find(item =>
      item.route && (item.exact ? url === item.route : url.startsWith(item.route))
    );
    this.setCurrentPage(matched);
  }

  private setCurrentPage(item?: NavItem): void {
    this.currentPageTitle = item?.label ?? 'Admin';
    this.currentPageIcon = item?.icon ?? 'bi-grid-1x2';
    this.currentPageDescription = item?.description ?? '';
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