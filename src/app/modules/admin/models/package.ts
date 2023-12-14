export class Package {
  packageId: string;
  packageName:string;
  packageCost: number;
  validatedDays:number;
  numberOfPoints:number;
  isActive:boolean;
  services: any[];
  expand: boolean = false;
}
