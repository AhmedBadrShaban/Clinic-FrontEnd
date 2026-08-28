import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ConfigService } from 'src/app/shared/services/config.service';
import { environment } from 'src/environments/environment';
import { MarkPaidResponse, PaymentStatus, ScheduleBillingDetail } from '../../models/schedule-billing.model';
import { buildMarkPaidResponse, mockBillingDetails, mockMarkPaidByBilling } from './schedule-billing-mock.data';

interface MarkPaidOutcome {
  success: boolean;
  error?: string;
  detail?: ScheduleBillingDetail;
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleBillingService {
  private readonly baseUrl: string;
  private readonly useMockData = environment.useMockData;

  /* Tracks which billingIds have been marked paid in the current session (mock only) */
  private paidIds = new Set<number>();

  constructor(private http: HttpClient, configService: ConfigService) {
    this.baseUrl = configService.getBaseUrl();
  }

  /** GET /receptionist/doctor-billing/{id} — full billing detail */
  getBillingDetail(id: number): Observable<ScheduleBillingDetail> {
    if (this.useMockData) {
      const detail = mockBillingDetails.find(d => d.id === id);
      if (!detail) return throwError(() => ({ status: 404, error: { message: 'Billing record not found' } }));
      return of({ ...detail }).pipe(delay(400));
    }
    return this.http.get<ScheduleBillingDetail>(`${this.baseUrl}receptionist/doctor-billing/${id}`);
  }

  /** PUT /receptionist/doctor-billing/{id}/mark-paid */
  markPaid(id: number): Observable<MarkPaidResponse> {
    if (this.useMockData) {
      const outcome = this.resolveMockMarkPaid(id);
      if (!outcome.success) {
        return throwError(() => ({ status: 400, error: { message: outcome.error } }));
      }
      return of(buildMarkPaidResponse(outcome.detail!, 'receptionist_sara')).pipe(delay(400));
    }
    return this.http.put<MarkPaidResponse>(`${this.baseUrl}receptionist/doctor-billing/${id}/mark-paid`, null);
  }

  /* Recompute the effective payment status used by the mock scheduler rows */
  effectiveStatusFor(billingId: number | null | undefined, incoming: PaymentStatus): PaymentStatus {
    if (this.paidIds.has(billingId ?? Number.MIN_SAFE_INTEGER)) return 'PAID';
    return incoming;
  }

  private resolveMockMarkPaid(billingId: number): MarkPaidOutcome {
    const detail = mockBillingDetails.find(d => d.id === billingId);
    if (!detail) {
      return { success: false, error: 'Billing record not found' };
    }
    if (this.paidIds.has(billingId) || detail.paymentStatus === 'PAID' || detail.paymentStatus === 'CANCELLED') {
      return { success: false, error: 'This billing record has already been paid or cancelled and cannot be marked as paid again' };
    }
    const cfg = mockMarkPaidByBilling[billingId];
    if (cfg && !cfg.pay) {
      return { success: false, error: cfg.error };
    }
    this.paidIds.add(billingId);
    return { success: true, detail };
  }
}
