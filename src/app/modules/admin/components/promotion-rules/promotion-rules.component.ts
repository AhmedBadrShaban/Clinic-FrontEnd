import { Component, OnInit, signal } from '@angular/core';
 
 import { Clinic } from 'src/app/shared/models/rooms.models';
import { PromotionRule } from '../../models/promotion-rules';
import { PromotionRulesService } from '../../services/promotion-rules.service';
import { ReportsService } from '../../services/reports.service';
import { PromotionRuleFormComponent } from './promotion-rule-form/promotion-rule-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

 

@Component({
  selector: 'app-promotion-rules',
   
  templateUrl: './promotion-rules.component.html',
  styleUrls: ['./promotion-rules.component.css']
})
export class PromotionRulesComponent implements OnInit {
  // Delete has no live backend endpoint yet — see PromotionRulesService.delete(). The
  // delete action stays hidden in the template (*ngIf="showDelete") until that ships.
  readonly showDelete = false;

  displayedColumns = ['ruleName', 'type', 'clinicName', 'active', 'updatedAt', 'actions'];

  rules = signal<PromotionRule[]>([]);
  clinics = signal<Clinic[]>([]);
  loading = signal(false);
  selectedClinicId = signal<number | null>(null);

  constructor(
    private promotionRulesService: PromotionRulesService,
    private reportsService: ReportsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.reportsService.getAllClinicsList().subscribe(clinics => this.clinics.set(clinics));
    this.loadRules();
  }

  loadRules(): void {
    this.loading.set(true);
    const clinicId = this.selectedClinicId() ?? undefined;
    this.promotionRulesService.getAll(clinicId).subscribe({
      next: rules => {
        this.rules.set(rules);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Failed to load promotion rules.', 'Dismiss', { duration: 4000 });
      }
    });
  }

  onClinicFilterChange(clinicId: number | null): void {
    this.selectedClinicId.set(clinicId);
    this.loadRules();
  }

  openCreateForm(): void {
    const ref = this.dialog.open(PromotionRuleFormComponent, {
      width: '640px',
      maxHeight: '90vh',
      data: { clinics: this.clinics() }
    });
    ref.afterClosed().subscribe(saved => {
      if (saved) {
        this.loadRules();
      }
    });
  }

  openEditForm(rule: PromotionRule): void {
    const ref = this.dialog.open(PromotionRuleFormComponent, {
      width: '640px',
      maxHeight: '90vh',
      data: { rule, clinics: this.clinics() }
    });
    ref.afterClosed().subscribe(saved => {
      if (saved) {
        this.loadRules();
      }
    });
  }

  toggleActive(rule: PromotionRule): void {
    const nextActive = !rule.active;
    this.promotionRulesService.setActive(rule.id, nextActive).subscribe({
      next: updated => {
        this.rules.update(list => list.map(r => (r.id === updated.id ? updated : r)));
        this.snackBar.open(
          nextActive ? `"${rule.ruleName}" activated.` : `"${rule.ruleName}" deactivated.`,
          'Dismiss',
          { duration: 3000 }
        );
      },
      error: err => {
        const message =
          err?.error?.message ?? 'Could not update this rule\'s active status.';
        this.snackBar.open(message, 'Dismiss', { duration: 5000 });
      }
    });
  }

  // Implemented per Ahmed's call, but intentionally never invoked from the template
  // (the delete button is hidden behind `showDelete`) since there's no backend
  // endpoint yet. Wire the button back up and flip `showDelete` once it ships.
  deleteRule(rule: PromotionRule): void {
    // this.promotionRulesService.delete(rule.id).subscribe({
    //   next: () => {
    //     this.rules.update(list => list.filter(r => r.id !== rule.id));
    //     this.snackBar.open(`"${rule.ruleName}" deleted.`, 'Dismiss', { duration: 3000 });
    //   },
    //   error: () => {
    //     this.snackBar.open('Could not delete this rule.', 'Dismiss', { duration: 4000 });
    //   }
    // });
  }

  typeLabel(type: PromotionRule['type']): string {
    switch (type) {
      case 'PERCENTAGE':
        return 'Percentage';
      case 'FREE_SERVICES':
        return 'Free Services';
      case 'FREE_PULSES':
        return 'Free Pulses';
    }
  }
}