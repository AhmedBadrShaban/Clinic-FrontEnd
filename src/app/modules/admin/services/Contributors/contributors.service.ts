import { Injectable } from '@angular/core';
import {Contributor} from "../../models/contributor";

@Injectable({
  providedIn: 'root'
})
export class ContributorsService {

  constructor() { }

  getData(): Contributor[]{
    return [
      {id: '5' , name: 'Ahmed'},
      {id: '5' , name: 'Ahmed'},
      {id: '5' , name: 'Ahmed'},
      {id: '5' , name: 'Ahmed'},
      {id: '5' , name: 'Ahmed'},
    ]
  }

}
