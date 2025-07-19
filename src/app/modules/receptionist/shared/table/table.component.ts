import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() columns: Array<{ key: string, label: string, template?: any }> = [];
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;

  @Output() onPageChange = new EventEmitter<PageEvent>();

  dataSource = new MatTableDataSource<any>([]);

  get displayedColumnsKeys(): string[] {
    return this.columns.map(col => col.key);
  }

  get displayedColumns() {
    return this.columns;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource.data = this.data;
    }
  }
}
