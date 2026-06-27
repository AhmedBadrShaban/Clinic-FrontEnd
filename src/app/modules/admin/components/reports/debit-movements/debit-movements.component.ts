import {
  Component,
  OnInit,
  ChangeDetectorRef,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { DebitReportsService, DebitMovement, DebitMovementsFilter } from '../../../services/reports/debit-reports.service';
 
export const MOVEMENT_TYPE_LABELS: Record<string, string> = {
  PACKAGE_RESERVED: 'Package Reserved',
  PRODUCT_RESERVED: 'Product Reserved',
  PAYMENT_ADDED: 'Payment Added',
  MANUAL_ADJUSTMENT: 'Manual Adjustment',
};

@Component({
  selector: 'app-debit-movements',
  templateUrl: './debit-movements.component.html',
  styleUrls: ['./debit-movements.component.css']
})
export class DebitMovementsComponent implements OnInit {
  @ViewChild('deltaTpl', { static: true }) deltaTpl!: TemplateRef<any>;
  @ViewChild('typeTpl', { static: true }) typeTpl!: TemplateRef<any>;
  @ViewChild('descriptionTpl', { static: true }) descriptionTpl!: TemplateRef<any>;
  @ViewChild('dateTpl', { static: true }) dateTpl!: TemplateRef<any>;

  /* ── filters ── */
  filters: DebitMovementsFilter = {
    sortBy: 'createdAt',
    sortDir: 'desc'
  };
  fromDateInput = '';
  toDateInput = '';

  readonly movementTypes = [
    { value: '', label: 'All Types' },
    { value: 'PACKAGE_RESERVED', label: 'Package Reserved' },
    { value: 'PRODUCT_RESERVED', label: 'Product Reserved' },
    { value: 'PAYMENT_ADDED', label: 'Payment Added' },
    { value: 'MANUAL_ADJUSTMENT', label: 'Manual Adjustment' },
  ];

  readonly movementLabels = MOVEMENT_TYPE_LABELS;

  // column key → backend sortBy value mapping
  private readonly sortKeyMap: Record<string, string> = {
    createdAt: 'createdAt',
    patientName: 'patientName',
    patientPhone: 'patientName',   // no backend sort for phone, fallback
    clinicName: 'clinicName',
    createdByName: 'createdByName',
    movementType: 'movementType',
    delta: 'delta',
    balanceAfter: 'balanceAfter',
    description: 'createdAt',     // no backend sort for description, fallback
  };

  /* ── table ── */
  tableColumns: Array<{ key: string; label: string; template?: any }> = [];
  dataSource = new MatTableDataSource<DebitMovement>();
  totalItems = 0;
  pageSize = 20;
  currentPage = 0;
  isLoading = false;

  constructor(
    private reportsService: DebitReportsService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.tableColumns = [
      { key: 'createdAt', label: 'Date', template: this.dateTpl },
      { key: 'patientName', label: 'Patient' },
      { key: 'patientPhone', label: 'Phone' },
      { key: 'clinicName', label: 'Clinic' },
      { key: 'createdByName', label: 'Receptionist' },
      { key: 'movementType', label: 'Type', template: this.typeTpl },
      { key: 'delta', label: 'Delta (EGP)', template: this.deltaTpl },
      { key: 'balanceAfter', label: 'Balance After (EGP)' },
      { key: 'description', label: 'Description', template: this.descriptionTpl },
    ];

    this.loadMovements();
  }

  loadMovements(resetPage = false): void {
    if (resetPage) this.currentPage = 0;

    this.filters.fromDate = this.fromDateInput
      ? new Date(this.fromDateInput).toISOString().slice(0, 19)
      : null;
    this.filters.toDate = this.toDateInput
      ? new Date(this.toDateInput + 'T23:59:59').toISOString().slice(0, 19)
      : null;

    this.isLoading = true;

    this.reportsService
      .getDebitMovements(this.currentPage, this.pageSize, this.filters)
      .subscribe({
        next: (res) => {
          this.dataSource.data = [...res.data];
          this.totalItems = res.totalItems;
          this.isLoading = false;
          this.cd.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.cd.detectChanges();
        }
      });
  }

  // Called by app-table's (onSortChange) — column header click
  onSortChange(event: { column: string; direction: string }): void {
    this.filters.sortBy = this.sortKeyMap[event.column] ?? 'createdAt';
    this.filters.sortDir = (event.direction === 'asc' ? 'asc' : 'desc');
    this.loadMovements(true);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMovements();
  }

  clearFilters(): void {
    this.filters = { sortBy: 'createdAt', sortDir: 'desc' };
    this.fromDateInput = '';
    this.toDateInput = '';
    this.loadMovements(true);
  }

  deltaClass(delta: number): string {
    if (delta > 0) return 'delta--positive';
    if (delta < 0) return 'delta--negative';
    return 'delta--zero';
  }

  deltaPrefix(delta: number): string {
    return delta > 0 ? '+' : '';
  }

  typeClass(type: string): string {
    const map: Record<string, string> = {
      PACKAGE_RESERVED: 'type-badge type-badge--package',
      PRODUCT_RESERVED: 'type-badge type-badge--product',
      PAYMENT_ADDED: 'type-badge type-badge--payment',
      MANUAL_ADJUSTMENT: 'type-badge type-badge--manual',
    };
    return map[type] ?? 'type-badge';
  }
}