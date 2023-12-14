import { Injectable } from "@angular/core";
import { User } from "../models/user";


@Injectable({
  providedIn :'root'
})
export class UserService{
    testUsers: User [] = [
      new User(1 , 'ahmed' , 'ahmed123', '1234'),
      new User(2 , 'Badr' , 'badr123', '12345'),
      new User(3 , 'ali' , 'ali123', '1234'),
      new User(4 , 'ragab' , 'ragab123', '1234')
    ]
}
