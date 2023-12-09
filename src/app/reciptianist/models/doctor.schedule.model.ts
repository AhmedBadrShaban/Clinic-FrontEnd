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
  disabled?: boolean;
  expand: boolean;
  checked: boolean;
}
