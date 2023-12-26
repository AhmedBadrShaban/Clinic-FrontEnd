export interface DailySheet {
  dailySheetId:number;
    patientName: string;
    doctorName:string;
    roomName:string;
    paymentType: string;
    cash: number;
    visa: number;
    credit:number;
    debit: number;
    instaPay: number;
    vodafoneCash: number;
    totalMoney: number;
    pulses: number;
    date:number;
    service:string;
    whatSheWillDo:string;
}
export interface DailySheetStatus{
  pulses: number;
  balance:number;
  startPulse:number;
  endPulse:number;
  status:boolean;
}
