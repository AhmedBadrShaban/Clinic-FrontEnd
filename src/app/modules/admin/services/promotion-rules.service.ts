import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';
import { PromotionRule, PromotionRulePayload } from '../models/promotion-rules';

@Injectable({
    providedIn: 'root'
})
export class PromotionRulesService {
    private readonly baseUrl;

    constructor(private http: HttpClient, private configService: ConfigService) {
        this.baseUrl = this.configService.getBaseUrl();
    }

    /** GET /admin/promotion-rules — omit clinicId to list across all clinics */
    getAll(clinicId?: number): Observable<PromotionRule[]> {
        let params = new HttpParams();
        if (clinicId !== undefined && clinicId !== null) {
            params = params.set('clinicId', clinicId.toString());
        }
        return this.http
            .get<PromotionRule[]>(`${this.baseUrl}admin/promotion-rules`, { params })
            .pipe(map(rules => rules.map(r => this.normalize(r))));
    }

    /** GET /admin/promotion-rules/{id} — used to prefill the edit form */
    getById(id: number): Observable<PromotionRule> {
        return this.http
            .get<PromotionRule>(`${this.baseUrl}admin/promotion-rules/${id}`)
            .pipe(map(r => this.normalize(r)));
    }

    /** POST /admin/promotion-rules */
    create(payload: PromotionRulePayload): Observable<PromotionRule> {
        return this.http
            .post<PromotionRule>(`${this.baseUrl}admin/promotion-rules`, payload)
            .pipe(map(r => this.normalize(r)));
    }

    /** PUT /admin/promotion-rules/{id} — full replace, resend every field */
    update(id: number, payload: PromotionRulePayload): Observable<PromotionRule> {
        return this.http
            .put<PromotionRule>(`${this.baseUrl}admin/promotion-rules/${id}`, payload)
            .pipe(map(r => this.normalize(r)));
    }

    /** PATCH /admin/promotion-rules/{id}/active?active=true|false */
    setActive(id: number, active: boolean): Observable<PromotionRule> {
        const params = new HttpParams().set('active', active.toString());
        return this.http
            .patch<PromotionRule>(`${this.baseUrl}admin/promotion-rules/${id}/active`, null, { params })
            .pipe(map(r => this.normalize(r)));
    }

    /**
     * Implemented per Ahmed's call, but NOT wired up anywhere yet: the current backend
     * contract has no DELETE endpoint, only activate/deactivate (setActive above). Once
     * backend ships a real delete endpoint, uncomment the call inside deleteRule() in
     * PromotionRulesComponent and un-hide the delete action in its template.
     */
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}admin/promotion-rules/${id}`);
    }

    /**
     * The activate/deactivate response docs note `configuration` comes back as a JSON
     * string ("expanded above for readability"). Normalizing defensively on every
     * endpoint in case list/detail/create behave the same way.
     */
    private normalize(rule: PromotionRule): PromotionRule {
        if (typeof rule.configuration === 'string') {
            try {
                return { ...rule, configuration: JSON.parse(rule.configuration) };
            } catch {
                return rule;
            }
        }
        return rule;
    }
}