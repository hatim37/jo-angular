import { Injectable } from '@angular/core';
import {newCode, User} from '../model/user.model';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UUIDTypes} from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import {Router} from '@angular/router';
import {jwtDecode} from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  options:any = {headers: new HttpHeaders().set('Content-Type', 'application/json')};
  public userId: any;
  public username: any;
  public roles: string[]=[];
  public authenticated : boolean = false;
  public exp : any;
  public jwtToken!: any;
  public name: any;
  email: any;

  constructor(private http:HttpClient, private router: Router) { }

  register(user:User) {
    return this.http.post(`${environment.backend_user}/registration`, user, this.options);
  }

  validation(activationCode: any) {
    return this.http.post(`${environment.backend_validation}/activation-send`, activationCode, this.options);
  }

  sendNewCode(id: newCode) {
    return this.http.post(`${environment.backend_validation}/validation-newSend`, id, this.options);
  }

  login(email: any, password: any) {
    let deviceId = this.getOrCreateDeviceId(email);
    let body = {username: email, password: password, devices: deviceId};
    return this.http.post(`${environment.backend_login}/signin`, body, this.options);
  }

  logout() {
    this.authenticated = false;
    this.jwtToken = undefined;
    this.username = undefined;
    this.roles = [];
    window.localStorage.removeItem('access-token');
    this.router.navigate(['/home']);
  }

  loadProfile(value: any) {
    this.authenticated = true;
    this.jwtToken = value['bearer'];
    let decodeJwt:any = jwtDecode(this.jwtToken);
    this.email = decodeJwt.sub;
    this.username = decodeJwt.username;
    this.userId = decodeJwt.id;
    this.roles = decodeJwt.scope;
    this.name = decodeJwt.name;
    this.exp = decodeJwt.exp;
    window.localStorage.setItem('access-token', this.jwtToken);
  }

  loadTokenFromLocalStorage() {
    let token = window.localStorage.getItem('access-token');
    let instant = Date.now();
    if (token) {
      this.loadProfile({'bearer':token});
    }
  }

  loginValidation(uuid:UUIDTypes) {
    let body = {uuid: uuid};
    return this.http.post(`${environment.backend_login}/signin-validation`, body, this.options);
  }

  getOrCreateDeviceId(email: string): string {
    let ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;
    let now = Date.now();
    // on récupère le tableau d'utilisateurs
    let arrStr = localStorage.getItem('deviceId');
    let users: { email: string, deviceId: string, creationDate: number }[] = [];
    if (arrStr) {
      try {
        users = JSON.parse(arrStr);
      } catch {
        users = [];
      }
    }
    // Recherche si cet email existe déjà et si son deviceId est valide
    let existing = users.find(u => u.email === email);
    if (existing && (now - existing.creationDate) < ONE_MONTH_MS) {
      return existing.deviceId;
    }
    // Sinon, crée un nouveau deviceId pour cet utilisateur
    let deviceId = uuidv4();
    // S'il existe déjà mais expiré, on remplace
    if (existing) {
      existing.deviceId = deviceId;
      existing.creationDate = now;
    } else {
      users.push({ email, deviceId, creationDate: now });
    }
    // Stockage unique sous la clé 'deviceId'
    localStorage.setItem('deviceId', JSON.stringify(users));
    return deviceId;
  }

}
