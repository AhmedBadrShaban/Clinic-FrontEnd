export interface DailySheet {
  dailySheetId:number;
    patientName: string;
    doctorName:string;
    roomName:string;
    paymentType: string;
    pulses: number;
    cash: number;
    visa: number;
    debit: number;
    totalMoney: number;
    startPulse:number;
    endPulse:number;
    status:boolean;
    date:number;
    whatSheWillDo:string;

}
