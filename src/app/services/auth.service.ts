import { Injectable } from '@angular/core';
import {newCode, User} from '../model/user.model';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  options:any = {headers: new HttpHeaders().set('Content-Type', 'application/json')};

  constructor(private http:HttpClient) { }

  register(user:User) {
    return this.http.post(`${environment.backend_user}/registration`, user, this.options);
  }

  validation(activationCode: any) {
    return this.http.post(`${environment.backend_validation}/activation-send`, activationCode, this.options);
  }

  sendNewCode(id: newCode) {
    return this.http.post(`${environment.backend_validation}/validation-newSend`, id, this.options);
  }
}
