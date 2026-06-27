import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';

export type WhatsAppMessageType = 'RESERVE_PACKAGE' | 'DEBIT_UPDATE' | 'CHECKOUT';
export type WhatsAppMessageStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'RETRYING' | 'ABANDONED';

export interface WhatsAppMessage {
    id: number;
    patientId: number;
    patientName: string;
    patientPhone: string;
    clinicId: number;
    clinicName: string;
    createdById: number;
    createdByName: string;
    messageType: WhatsAppMessageType;
    phoneNumber: string;
    pdfUrl: string | null;
    status: WhatsAppMessageStatus;
    failureReason: string | null;
    retryCount: number;
    twilioMessageSid: string | null;
    referenceId: number | null;
    referenceType: string | null;
    createdAt: string;
    updatedAt: string;
    sentAt: string | null;
    nextRetryAt: string | null;
}

export interface WhatsAppMessagesResponse {
    data: WhatsAppMessage[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
}

export interface WhatsAppMessagesFilter {
    patientId?: number | null;
    clinicId?: number | null;
    createdBy?: number | null;
    messageType?: WhatsAppMessageType | null;
    status?: WhatsAppMessageStatus | null;
    fromDate?: string | null;
    toDate?: string | null;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}

export interface WhatsAppDailyStat {
    date: string;
    sentCount: number;
    failedCount: number;
    retryingCount: number;
}

export interface WhatsAppStatsFilter {
    clinicId?: number | null;
    fromDate?: string | null;
    toDate?: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class WhatsAppMessagesService {
    private readonly baseUrl: string;

    constructor(private http: HttpClient, private configService: ConfigService) {
        this.baseUrl = this.configService.getBaseUrl();
    }

    getMessages(
        page: number = 0,
        size: number = 20,
        filters: WhatsAppMessagesFilter = {}
    ): Observable<WhatsAppMessagesResponse> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (filters.patientId) params = params.set('patientId', filters.patientId.toString());
        if (filters.clinicId) params = params.set('clinicId', filters.clinicId.toString());
        if (filters.createdBy) params = params.set('createdBy', filters.createdBy.toString());
        if (filters.messageType) params = params.set('messageType', filters.messageType);
        if (filters.status) params = params.set('status', filters.status);
        if (filters.fromDate) params = params.set('fromDate', filters.fromDate);
        if (filters.toDate) params = params.set('toDate', filters.toDate);
        if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
        if (filters.sortDir) params = params.set('sortDir', filters.sortDir);

        return this.http.get<WhatsAppMessagesResponse>(`${this.baseUrl}admin/whatsapp-messages`, { params });
    }

    getDailyStats(filters: WhatsAppStatsFilter = {}): Observable<WhatsAppDailyStat[]> {
        let params = new HttpParams();

        if (filters.clinicId) params = params.set('clinicId', filters.clinicId.toString());
        if (filters.fromDate) params = params.set('fromDate', filters.fromDate);
        if (filters.toDate) params = params.set('toDate', filters.toDate);

        return this.http.get<WhatsAppDailyStat[]>(`${this.baseUrl}admin/whatsapp-messages/stats`, { params });
    }

    retryMessage(id: number): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${this.baseUrl}admin/whatsapp-messages/${id}/retry`, {});
    }
}