export interface Doctors {
    doctorId?: string;
    doctorName: string;
    userName:string;
    email : string;
    phoneNumber: string;
    nationalID : string;
    address: string;
    pricePerHour: number;
    joinedAt: string;
    hour: number;
    isLaser: boolean;
    isActive:boolean;
    laserCost: number;
    doctor?:{
      username:string;
      password:string;
    }
    pulsesPercentage : number;
    numberPulses: number;
    MonthlyHours : number;
    password:string
}
