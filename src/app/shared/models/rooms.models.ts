export interface Room {
    roomId: number;
    roomName: string;
    clinicName?: string;
    isActive?: boolean;
    description?: string;
}

export interface RoomReservation {
    roomId: number;
    roomName: string;
    reservations: Reservation[];
}

export interface Reservation {
    reservationId: number;
    patientName: string;
    patientPhone: string;
    doctorName: string;
    roomName?: string;
    roomId?: number;
    reservationStart: string;
    reservationEnd: string;
    reservationDate: string;
    status: ReservationStatus;
    services?: string[];
    note?: string;
    generalNote?: string;
    hasDebit?: boolean;
}

export type ReservationStatus =
    | 'IN_PROGRESS'
    | 'CONFIRMED'
    | 'WAITING'
    | 'TO_DOCTOR'
    | 'DONE'
    | 'CANCELLED'
    | 'CANCELED'
    | 'COMPLETED';

export interface TimeSlot {
    startTime: string;
    endTime: string;
    available: boolean;
    reservationId?: number;
    patientName?: string;
    width?: number;
    reservation?: any;   
}
export interface Clinic {
    clinicId?:number;
    clinicName: string;

}

export interface RoomsHeaderState {
    clinics: string[];
    selectedClinic: string | null;
    selectedDate: string;
    activeRoom: Room | undefined;
    isAdmin: boolean;
}