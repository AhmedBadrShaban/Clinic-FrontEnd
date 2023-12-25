import { Injectable } from '@angular/core';
import {ContData} from "../Models/cont-data";

@Injectable({
  providedIn: 'root'
})
export class ContServiceService {

  constructor() { }

  getData(): ContData []{
    return [
      {
        date: '20-30-2003',
        profit: 250,
        expenses: 548,
        total: 750
      },
      {
        date: '20-30-2003',
        profit: 250,
        expenses: 548,
        total: 750
      },
      {
        date: '20-30-2003',
        profit: 250,
        expenses: 548,
        total: 750
      },
      {
        date: '20-30-2003',
        profit: 250,
        expenses: 548,
        total: 750
      },
      {
        date: '20-30-2003',
        profit: 250,
        expenses: 548,
        total: 750
      },
      {
        date: '20-30-2003',
        profit: 250,
        expenses: 548,
        total: 750
      }
    ]
  }
}
