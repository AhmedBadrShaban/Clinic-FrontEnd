import { Component, Inject, OnInit, signal, computed } from '@angular/core';
 import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
   ValidationErrors,
  Validators
} from '@angular/forms';
 
 
import { Clinic } from 'src/app/shared/models/rooms.models';
import { ServiceService } from 'src/app/modules/admin/services/services/service.service';
import { PromotionRule, PatientServiceLite, PromotionRuleType, PercentageConfiguration, FreeServicesConfiguration, FreePulsesConfiguration, PromotionRulePayload } from '../../../models/promotion-rules';
import { PromotionRulesService } from '../../../services/promotion-rules.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface PromotionRuleFormData {
  rule?: PromotionRule;
  clinics: Clinic[];
}

function atLeastOneSelected(control: AbstractControl): ValidationErrors | null {
  const value = (control.value as number[]) ?? [];
  return value.length > 0 ? null : { required: true };
}

@Component({
  selector: 'app-promotion-rule-form',
 
  templateUrl: './promotion-rule-form.component.html',
  styleUrls: ['./promotion-rule-form.component.css']
})
export class PromotionRuleFormComponent implements OnInit {
  readonly isEdit: boolean;
  saving = signal(false);
  loadingServices = signal(false);

  allServices = signal<PatientServiceLite[]>([]);
  serviceFilter = signal('');
  filteredServices = computed(() => {
    const filter = this.serviceFilter().trim().toLowerCase();
    const selectedIds = new Set(this.form.get('freeServices.serviceIds')?.value ?? []);
    return this.allServices()
      .filter(s => !selectedIds.has(s.patientServiceId))
      .filter(s => !filter || s.serviceName.toLowerCase().includes(filter));
  });

  form: FormGroup = this.fb.group({
    ruleName: ['', [Validators.required]],
    type: ['PERCENTAGE' as PromotionRuleType, [Validators.required]],
    clinicId: [null as number | null, [Validators.required]],
    active: [true],
    tiers: this.fb.array([this.createTierGroup()]),
    freeServices: this.fb.group({
      from: [null as number | null, [Validators.required, Validators.min(0)]],
      to: [null as number | null, [Validators.required, Validators.min(0)]],
      serviceIds: [[] as number[], [atLeastOneSelected]]
    }),
    freePulses: this.fb.group({
      pulses: [null as number | null, [Validators.required, Validators.min(1)]],
      from: [null as number | null],
      to: [null as number | null]
    })
  });

  constructor(
    private fb: FormBuilder,
    private promotionRulesService: PromotionRulesService,
    private serviceService: ServiceService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PromotionRuleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PromotionRuleFormData
  ) {
    this.isEdit = !!data.rule;
  }

  ngOnInit(): void {
    this.loadServices();
    this.applyTypeValidators(this.form.get('type')!.value);
    this.form.get('type')!.valueChanges.subscribe(type => this.applyTypeValidators(type));

    if (data_rule(this.data)) {
      this.patchFromExistingRule(this.data.rule!);
    }
  }

  get tiers(): FormArray {
    return this.form.get('tiers') as FormArray;
  }

  createTierGroup(from: number | null = null, to: number | null = null, percentage: number | null = null): FormGroup {
    return this.fb.group({
      from: [from, [Validators.required, Validators.min(0)]],
      to: [to], // optional — last tier can be open-ended
      percentage: [percentage, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  addTier(): void {
    this.tiers.push(this.createTierGroup());
  }

  removeTier(index: number): void {
    if (this.tiers.length > 1) {
      this.tiers.removeAt(index);
    }
  }

  private loadServices(): void {
    this.loadingServices.set(true);
 
    this.serviceService.getAllServices(0, 200).subscribe({
      next: (res: any) => {
        const services: PatientServiceLite[] = (res?.data ?? []).map((s: any) => ({
          patientServiceId: s.patientServiceId,
          serviceName: s.serviceName,
          isActive: s.isActive
        }));
        this.allServices.set(services);
        this.loadingServices.set(false);
      },
      error: () => {
        this.loadingServices.set(false);
        this.snackBar.open('Failed to load services list.', 'Dismiss', { duration: 4000 });
      }
    });
  }

  onServiceFilterChange(value: string): void {
    this.serviceFilter.set(value);
  }

  addService(service: PatientServiceLite): void {
    const control = this.form.get('freeServices.serviceIds')!;
    const current: number[] = control.value ?? [];
    if (!current.includes(service.patientServiceId)) {
      control.setValue([...current, service.patientServiceId]);
      control.markAsDirty();
    }
    this.serviceFilter.set('');
  }

  removeService(serviceId: number): void {
    const control = this.form.get('freeServices.serviceIds')!;
    const current: number[] = control.value ?? [];
    control.setValue(current.filter(id => id !== serviceId));
    control.markAsDirty();
  }

  serviceName(serviceId: number): string {
    return this.allServices().find(s => s.patientServiceId === serviceId)?.serviceName ?? `#${serviceId}`;
  }

  get selectedServiceIds(): number[] {
    return this.form.get('freeServices.serviceIds')?.value ?? [];
  }

  /** Only the fields belonging to the selected type are required; the rest are cleared of validators. */
  private applyTypeValidators(type: PromotionRuleType): void {
    const tiersArray = this.tiers;
    const freeServices = this.form.get('freeServices') as FormGroup;
    const freePulses = this.form.get('freePulses') as FormGroup;

    const setGroupValidators = (group: FormGroup, active: boolean, requiredKeys: string[]) => {
      Object.keys(group.controls).forEach(key => {
        const control = group.get(key)!;
        if (active && requiredKeys.includes(key)) {
          control.enable({ emitEvent: false });
        } else {
          control.disable({ emitEvent: false });
        }
      });
    };

    if (type === 'PERCENTAGE') {
      tiersArray.enable({ emitEvent: false });
    } else {
      tiersArray.disable({ emitEvent: false });
    }

    setGroupValidators(freeServices, type === 'FREE_SERVICES', ['from', 'to', 'serviceIds']);
    setGroupValidators(freePulses, type === 'FREE_PULSES', ['pulses', 'from', 'to']);
  }

  private patchFromExistingRule(rule: PromotionRule): void {
    this.form.patchValue({
      ruleName: rule.ruleName,
      type: rule.type,
      clinicId: rule.clinicId,
      active: rule.active
    });

    if (rule.type === 'PERCENTAGE') {
      const config = rule.configuration as PercentageConfiguration;
      this.tiers.clear();
      config.tiers.forEach(t => this.tiers.push(this.createTierGroup(t.from, t.to ?? null, t.percentage)));
    } else if (rule.type === 'FREE_SERVICES') {
      const config = rule.configuration as FreeServicesConfiguration;
      this.form.get('freeServices')!.patchValue({
        from: config.from,
        to: config.to,
        serviceIds: config.serviceIds ?? []
      });
    } else if (rule.type === 'FREE_PULSES') {
      const config = rule.configuration as FreePulsesConfiguration;
      this.form.get('freePulses')!.patchValue({
        pulses: config.pulses,
        from: config.from ?? null,
        to: config.to ?? null
      });
    }

    this.applyTypeValidators(rule.type);
  }

  private buildPayload(): PromotionRulePayload {
    const raw = this.form.getRawValue();
    let configuration;

    switch (raw.type as PromotionRuleType) {
      case 'PERCENTAGE':
        configuration = {
          tiers: raw.tiers.map((t: any) => ({
            from: t.from,
            ...(t.to !== null && t.to !== undefined ? { to: t.to } : {}),
            percentage: t.percentage
          }))
        } as PercentageConfiguration;
        break;
      case 'FREE_SERVICES':
        configuration = {
          from: raw.freeServices.from,
          to: raw.freeServices.to,
          serviceIds: raw.freeServices.serviceIds
        } as FreeServicesConfiguration;
        break;
      case 'FREE_PULSES':
        configuration = {
          pulses: raw.freePulses.pulses,
          ...(raw.freePulses.from !== null ? { from: raw.freePulses.from } : {}),
          ...(raw.freePulses.to !== null ? { to: raw.freePulses.to } : {})
        } as FreePulsesConfiguration;
        break;
    }

    return {
      ruleName: raw.ruleName,
      type: raw.type,
      configuration,
      active: raw.active,
      clinicId: raw.clinicId
    };
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Please fix the highlighted fields before saving.', 'Dismiss', { duration: 4000 });
      return;
    }

    const payload = this.buildPayload();
    this.saving.set(true);

    const request$ = this.isEdit
      ? this.promotionRulesService.update(this.data.rule!.id, payload)
      : this.promotionRulesService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.snackBar.open(this.isEdit ? 'Promotion rule updated.' : 'Promotion rule created.', 'Dismiss', {
          duration: 3000
        });
        this.dialogRef.close(true);
      },
      error: err => {
        this.saving.set(false);
        const message = err?.error?.message ?? 'Could not save this promotion rule.';
        this.snackBar.open(message, 'Dismiss', { duration: 5000 });
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}

// Small helper kept outside the class body purely for a readable `if` in ngOnInit.
function data_rule(data: PromotionRuleFormData): boolean {
  return !!data.rule;
}