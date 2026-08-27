export type SchedulePaymentStatus = 'PENDING' | 'PAID' | 'CANCELLED' | null;

export interface scheduleData {
  schedulerId:number;
  new:boolean;
  roomName: string;
  doctorName: string;
  date: string;
  startTime: string;
  endTime: string;
  confirmed:boolean;
  startPulses:number;
  endPulses:number;
  clinic?: string;
  billingId?: number | null;
  paymentStatus?: SchedulePaymentStatus;
  disabled?: boolean;
  expand: boolean;
  checked: boolean;
}
