export interface DailySheet {
  dailySheetId:number;
    patientName: string;
    doctorName:string;
    roomName:string;
    paymentType: string;
    pulses: number;
    cash: number;
    visa: number;
    credit:number;
    debit: number;
    instaPay: number;
    vCash: number;
    totalMoney: number;
    startPulse:number;
    endPulse:number;
    status:boolean;
    date:number;
    service:string;
    whatSheWillDo:string;

}
