export type PromotionRuleType = 'PERCENTAGE' | 'FREE_SERVICES' | 'FREE_PULSES';

export interface PercentageTier {
    from: number;
    to?: number; // last tier is typically left open-ended (no "to")
    percentage: number;
}

export interface PercentageConfiguration {
    tiers: PercentageTier[];
}

/**
 * NOTE: the backend contract only documented the PERCENTAGE `configuration` shape
 * (it referenced "§6" for FREE_SERVICES / FREE_PULSES, which wasn't included in what
 * was shared). The two shapes below are our best guess, built from the AC field lists:
 *   - FREE_SERVICES: From (EGP), To (EGP), multi-select Services
 *   - FREE_PULSES:   Pulses, optional From (EGP) / To (EGP)
 * If the real backend shape differs, this file plus the two serialize/deserialize
 * blocks in PromotionRuleFormComponent are the only places that need to change.
 */
export interface FreeServicesConfiguration {
    from: number;
    to: number;
    serviceIds: number[];
}

export interface FreePulsesConfiguration {
    pulses: number;
    from?: number;
    to?: number;
}

export type PromotionRuleConfiguration =
    | PercentageConfiguration
    | FreeServicesConfiguration
    | FreePulsesConfiguration;

export interface PromotionRule {
    id: number;
    ruleName: string;
    type: PromotionRuleType;
    configuration: PromotionRuleConfiguration;
    active: boolean;
    clinicId: number;
    clinicName?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PromotionRulePayload {
    ruleName: string;
    type: PromotionRuleType;
    configuration: PromotionRuleConfiguration;
    active: boolean;
    clinicId: number;
}

/** Minimal shape we need from ServiceService's responses for the FREE_SERVICES picker. */
export interface PatientServiceLite {
    patientServiceId: number;
    serviceName: string;
    isActive: boolean;
}