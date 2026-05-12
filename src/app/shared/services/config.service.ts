import { Injectable } from '@angular/core';

@Injectable({
  providedIn :'root'
})
export class ConfigService{
    private baseUrl: string ="https://clinicdeploy-production.up.railway.app/";

    getBaseUrl(): string {
        this.baseUrl = "http://187.127.83.26:8080/"
        return this.baseUrl;
    }

}
