import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnChanges, AfterViewInit {
  @Input() data: any[] = [];
  @Input() columns: Array<{ key: string, label: string, template?: any }> = [];
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;

  @Input() isLoading: boolean = false;
  @Input() emptyTitle: string = 'No Data Available';
  @Input() emptyMessage: string = 'There are no records to display at this time.';

  @Output() onPageChange = new EventEmitter<PageEvent>();
  @Output() onSortChange = new EventEmitter<{ column: string; direction: string }>();

  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>([]);

  get displayedColumnsKeys(): string[] {
    return this.columns.map(col => col.key);
  }

  get displayedColumns() {
    return this.columns;
  }

  get isServerSideSort(): boolean {
    return this.onSortChange.observed;
  }

  ngAfterViewInit(): void {
    // sort is always in DOM now — safe to attach once here
    if (!this.isServerSideSort) {
      this.dataSource.sort = this.sort;
    } else {
      this.sort.sortChange.subscribe((sortState: Sort) => {
        this.onSortChange.emit({
          column: sortState.active,
          direction: sortState.direction
        });
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource.data = this.data;
    }
  }
}