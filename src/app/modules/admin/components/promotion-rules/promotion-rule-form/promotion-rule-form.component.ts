import { Component, Inject, OnInit, signal } from '@angular/core';
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
import {
  PromotionRule,
  PatientServiceLite,
  PromotionRuleType,
  PercentageConfiguration,
  FreeServicesConfiguration,
  FreePulsesConfiguration,
  PromotionRulePayload
} from '../../../models/promotion-rules';
import { PromotionRulesService } from '../../../services/promotion-rules.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface PromotionRuleFormData {
  rule?: PromotionRule;
  clinics: Clinic[];
}

/** Used on each FREE_SERVICES tier's `services` FormArray — must have at least one service. */
function minLengthArray(min: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const arr = control as FormArray;
    return arr && arr.length >= min ? null : { minLengthArray: true };
  };
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
  /** One filter string per FREE_SERVICES tier, indexed the same as freeServicesTiers. */
  serviceFilters = signal<string[]>(['']);

  form: FormGroup = this.fb.group({
    ruleName: ['', [Validators.required]],
    type: ['PERCENTAGE' as PromotionRuleType, [Validators.required]],
    clinicId: [null as number | null, [Validators.required]],
    active: [true],
    tiers: this.fb.array([this.createPercentageTierGroup()]),
    freeServicesTiers: this.fb.array([this.createFreeServicesTierGroup()]),
    freePulsesTiers: this.fb.array([this.createFreePulsesTierGroup()])
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

  // ---------- PERCENTAGE tiers ----------

  get tiers(): FormArray {
    return this.form.get('tiers') as FormArray;
  }

  createPercentageTierGroup(from: number | null = null, to: number | null = null, percentage: number | null = null): FormGroup {
    return this.fb.group({
      from: [from, [Validators.required, Validators.min(0)]],
      to: [to], // optional — last tier can be open-ended
      percentage: [percentage, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  addTier(): void {
    this.tiers.push(this.createPercentageTierGroup());
  }

  removeTier(index: number): void {
    if (this.tiers.length > 1) {
      this.tiers.removeAt(index);
    }
  }

  // ---------- FREE_SERVICES tiers ----------

  get freeServicesTiers(): FormArray {
    return this.form.get('freeServicesTiers') as FormArray;
  }

  freeServicesTierGroup(tierIndex: number): FormGroup {
    return this.freeServicesTiers.at(tierIndex) as FormGroup;
  }

  freeServicesArray(tierIndex: number): FormArray {
    return this.freeServicesTierGroup(tierIndex).get('services') as FormArray;
  }

  createFreeServicesTierGroup(
    from: number | null = null,
    to: number | null = null,
    services: { serviceId: number; sessions: number; validatedDays: number }[] = []
  ): FormGroup {
    return this.fb.group({
      from: [from, [Validators.required, Validators.min(0)]],
      to: [to, [Validators.required, Validators.min(0)]],
      services: this.fb.array(
        services.map(s => this.createFreeServiceItemGroup(s.serviceId, s.sessions, s.validatedDays)),
        [minLengthArray(1)]
      )
    });
  }

  createFreeServiceItemGroup(serviceId: number, sessions: number | null = 1, validatedDays: number | null = 30): FormGroup {
    return this.fb.group({
      serviceId: [serviceId, [Validators.required]],
      sessions: [sessions, [Validators.required, Validators.min(1)]],
      validatedDays: [validatedDays, [Validators.required, Validators.min(1)]]
    });
  }

  addFreeServicesTier(): void {
    this.freeServicesTiers.push(this.createFreeServicesTierGroup());
    this.serviceFilters.update(filters => [...filters, '']);
  }

  removeFreeServicesTier(index: number): void {
    if (this.freeServicesTiers.length > 1) {
      this.freeServicesTiers.removeAt(index);
      this.serviceFilters.update(filters => filters.filter((_, i) => i !== index));
    }
  }

  addServiceToTier(tierIndex: number, service: PatientServiceLite): void {
    const arr = this.freeServicesArray(tierIndex);
    const alreadyAdded = arr.controls.some(c => c.get('serviceId')?.value === service.patientServiceId);
    if (!alreadyAdded) {
      arr.push(this.createFreeServiceItemGroup(service.patientServiceId));
      arr.markAsDirty();
    }
    this.setServiceFilter(tierIndex, '');
  }

  removeServiceFromTier(tierIndex: number, serviceIndex: number): void {
    const arr = this.freeServicesArray(tierIndex);
    arr.removeAt(serviceIndex);
    arr.markAsDirty();
  }

  serviceFilter(tierIndex: number): string {
    return this.serviceFilters()[tierIndex] ?? '';
  }

  setServiceFilter(tierIndex: number, value: string): void {
    this.serviceFilters.update(filters => {
      const next = [...filters];
      next[tierIndex] = value;
      return next;
    });
  }

  filteredServicesForTier(tierIndex: number): PatientServiceLite[] {
    const filter = this.serviceFilter(tierIndex).trim().toLowerCase();
    const selectedIds = new Set(this.freeServicesArray(tierIndex).controls.map(c => c.get('serviceId')?.value));
    return this.allServices()
      .filter(s => !selectedIds.has(s.patientServiceId))
      .filter(s => !filter || s.serviceName.toLowerCase().includes(filter));
  }

  serviceName(serviceId: number): string {
    return this.allServices().find(s => s.patientServiceId === serviceId)?.serviceName ?? `#${serviceId}`;
  }

  // ---------- FREE_PULSES tiers ----------

  get freePulsesTiers(): FormArray {
    return this.form.get('freePulsesTiers') as FormArray;
  }

  createFreePulsesTierGroup(pulses: number | null = null, from: number | null = null, to: number | null = null): FormGroup {
    return this.fb.group({
      pulses: [pulses, [Validators.required, Validators.min(1)]],
      from: [from],
      to: [to]
    });
  }

  addFreePulsesTier(): void {
    this.freePulsesTiers.push(this.createFreePulsesTierGroup());
  }

  removeFreePulsesTier(index: number): void {
    if (this.freePulsesTiers.length > 1) {
      this.freePulsesTiers.removeAt(index);
    }
  }

  // ---------- shared ----------

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

  /** Only the FormArray belonging to the selected type stays enabled; the rest are disabled (and excluded from validation). */
  private applyTypeValidators(type: PromotionRuleType): void {
    if (type === 'PERCENTAGE') {
      this.tiers.enable({ emitEvent: false });
    } else {
      this.tiers.disable({ emitEvent: false });
    }

    if (type === 'FREE_SERVICES') {
      this.freeServicesTiers.enable({ emitEvent: false });
    } else {
      this.freeServicesTiers.disable({ emitEvent: false });
    }

    if (type === 'FREE_PULSES') {
      this.freePulsesTiers.enable({ emitEvent: false });
    } else {
      this.freePulsesTiers.disable({ emitEvent: false });
    }
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
      config.tiers.forEach(t => this.tiers.push(this.createPercentageTierGroup(t.from, t.to ?? null, t.percentage)));
    } else if (rule.type === 'FREE_SERVICES') {
      const config = rule.configuration as FreeServicesConfiguration;
      this.freeServicesTiers.clear();
      this.serviceFilters.set(config.tiers.map(() => ''));
      config.tiers.forEach(t => this.freeServicesTiers.push(this.createFreeServicesTierGroup(t.from, t.to, t.services)));
    } else if (rule.type === 'FREE_PULSES') {
      const config = rule.configuration as FreePulsesConfiguration;
      this.freePulsesTiers.clear();
      config.tiers.forEach(t => this.freePulsesTiers.push(this.createFreePulsesTierGroup(t.pulses, t.from ?? null, t.to ?? null)));
    }

    this.applyTypeValidators(rule.type);
  }

  private buildPayload(): PromotionRulePayload {
    const raw = this.form.getRawValue();
    let configuration: PercentageConfiguration | FreeServicesConfiguration | FreePulsesConfiguration;

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
          tiers: raw.freeServicesTiers.map((t: any) => ({
            from: t.from,
            to: t.to,
            services: t.services.map((s: any) => ({
              serviceId: s.serviceId,
              sessions: s.sessions,
              validatedDays: s.validatedDays
            }))
          }))
        } as FreeServicesConfiguration;
        break;
      case 'FREE_PULSES':
        configuration = {
          tiers: raw.freePulsesTiers.map((t: any) => ({
            pulses: t.pulses,
            ...(t.from !== null && t.from !== undefined ? { from: t.from } : {}),
            ...(t.to !== null && t.to !== undefined ? { to: t.to } : {})
          }))
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