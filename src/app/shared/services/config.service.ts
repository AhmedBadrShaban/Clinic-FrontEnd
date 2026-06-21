import { Injectable } from '@angular/core';
 
@Injectable({
  providedIn :'root'
})
export class ConfigService{
    // private baseUrl: string ="https://clinicdeploy-production.up.railway.app/";
    private baseUrl: string = "https://uclinic.tech/";
  
    getBaseUrl(): string {
        return this.baseUrl;
    }

}
