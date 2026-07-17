import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';

export type PackageMovementType =
    | 'PACKAGE_RESERVED'
    | 'CHECKOUT_SESSION_DEDUCTED'
    | 'CHECKOUT_POINTS_DEDUCTED'
    | 'MANUAL_SESSION_ADJUSTMENT'
    | 'MANUAL_POINTS_ADJUSTMENT'
    | 'PACKAGE_REMOVED';

export type PackageMovementReferenceType = 'PACKAGE' | 'CHECKOUT' | 'MANUAL';

export interface PackageMovement {
    id: number;
    patientId: number;
    patientName: string;
    patientPhone: string;
    clinicId: number;
    clinicName: string;
    createdById: number;
    createdByName: string;
    reservedPackageId: number;
    packageName: string;
    reservedServiceId: number | null;
    serviceName: string | null;
    sessionsDelta: number;
    sessionsAfter: number;
    pointsDelta: number;
    pointsAfter: number;
    movementType: PackageMovementType;
    referenceId: number | null;
    referenceType: PackageMovementReferenceType | null;
    doctorName: string | null;
    roomName: string | null;
    description: string;
    createdAt: string;
}

export interface PackageMovementsResponse {
    data: PackageMovement[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
}

export interface PackageMovementsFilter {
    patientId?: number | null;
    patientPhone?: string | null;
    clinicId?: number | string | null;
    createdBy?: number | null;
    movementType?: string | null;
    reservedPackageId?: number | null;
    packageName?: string | null;
    serviceName?: string | null;
    fromDate?: string | null;
    toDate?: string | null;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}

@Injectable({
    providedIn: 'root'
})
export class PackageReportsService {
    private readonly baseUrl: string;

    constructor(private http: HttpClient, private configService: ConfigService) {
        this.baseUrl = this.configService.getBaseUrl();
    }

    getPackageMovements(
        page: number = 0,
        size: number = 20,
        filters: PackageMovementsFilter = {}
    ): Observable<PackageMovementsResponse> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (filters.patientId) params = params.set('patientId', filters.patientId.toString());
        if (filters.patientPhone) params = params.set('patientPhone', filters.patientPhone);
        if (filters.clinicId) params = params.set('clinicId', filters.clinicId.toString());
        if (filters.createdBy) params = params.set('createdBy', filters.createdBy.toString());
        if (filters.movementType) params = params.set('movementType', filters.movementType);
        if (filters.reservedPackageId) params = params.set('reservedPackageId', filters.reservedPackageId.toString());
        if (filters.packageName) params = params.set('packageName', filters.packageName);
        if (filters.serviceName) params = params.set('serviceName', filters.serviceName);
        if (filters.fromDate) params = params.set('fromDate', filters.fromDate);
        if (filters.toDate) params = params.set('toDate', filters.toDate);
        if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
        if (filters.sortDir) params = params.set('sortDir', filters.sortDir);

        return this.http.get<PackageMovementsResponse>(`${this.baseUrl}admin/package-movements`, { params });
    }
}