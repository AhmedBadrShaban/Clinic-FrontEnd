export type PromotionRuleType = 'PERCENTAGE' | 'FREE_SERVICES' | 'FREE_PULSES';

export interface PercentageTier {
    from: number;
    to?: number; // last tier is typically left open-ended (no "to")
    percentage: number;
}
export interface PercentageConfiguration {
    tiers: PercentageTier[];
}

export interface FreeServiceItem {
    serviceId: number;
    sessions: number;
    validatedDays: number;
}
export interface FreeServicesTier {
    from: number;
    to: number;
    services: FreeServiceItem[];
}
export interface FreeServicesConfiguration {
    tiers: FreeServicesTier[];
}

export interface FreePulsesTier {
    pulses: number;
    /**
     * ASSUMPTION (unconfirmed by backend team): a tier with no from/to is an
     * unconditional / default tier that applies regardless of purchase amount.
     * If the real semantics differ (e.g. tiers stack, or a missing range means
     * something else), this comment + the "add unconditional tier" button in
     * the form component are the places to change.
     */
    from?: number;
    to?: number;
}
export interface FreePulsesConfiguration {
    tiers: FreePulsesTier[];
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

/**
 * Shape we build in the form. `configuration` here is a real object — the
 * service is responsible for JSON.stringify-ing it into PromotionRuleWirePayload
 * before it hits the wire, since the backend expects `configuration` as a
 * JSON-encoded string on create/update (confirmed against real examples), not
 * a nested JSON object.
 */
export interface PromotionRulePayload {
    ruleName: string;
    type: PromotionRuleType;
    configuration: PromotionRuleConfiguration;
    active: boolean;
    clinicId: number;
}

/** The actual request-body shape sent over HTTP. */
export interface PromotionRuleWirePayload {
    ruleName: string;
    type: PromotionRuleType;
    configuration: string;
    active: boolean;
    clinicId: number;
}

/** Minimal shape we need from ServiceService's responses for the FREE_SERVICES picker. */
export interface PatientServiceLite {
    patientServiceId: number;
    serviceName: string;
    isActive: boolean;
}