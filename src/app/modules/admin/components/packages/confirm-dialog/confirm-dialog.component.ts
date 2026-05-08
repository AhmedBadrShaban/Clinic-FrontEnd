import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="confirm-dialog">
      <h2 class="confirm-title">{{ data.title }}</h2>
      <p class="confirm-msg" [innerHTML]="data.message"></p>
      <div class="confirm-actions">
        <button class="btn-cancel" (click)="ref.close(false)">Cancel</button>
        <button class="btn-confirm" (click)="ref.close(true)">Confirm</button>
      </div>
    </div>
  `,
  styles: [`
    
    .confirm-dialog {
  padding: 24px;
}

.confirm-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--text-primary, #1a1a1a);
}

.confirm-msg {
  font-size: 14px;
  color: #555;
  margin: 0 0 24px;
  line-height: 1.6;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel {
  padding: 8px 18px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
}

.btn-confirm {
  padding: 8px 18px;
  border: none;
  border-radius: 8px;
  background: #4f46e5;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}

.btn-confirm:hover { background: #4338ca; }
.btn-cancel:hover  { background: #f5f5f5; }
    `]
})
export class ConfirmDialogComponent {
  constructor(
    public ref: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) { }
}