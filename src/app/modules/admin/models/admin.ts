export enum StatusOfAdmin{
    ACTIVE = 'active',
    SUSPENDED = 'suspended'
  }
export interface Admin {
    id: string;
  name: string;
  nationalId: string;
  phoneNumber: string;
  address: string;
  email: string;
  salary: number;
  status: string;
}
