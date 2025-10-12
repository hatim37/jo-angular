import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';
import {DecryptDto} from '../../model/decryptDto.model';
import {User} from '../../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  options:any = {headers: new HttpHeaders().set('Content-Type', 'application/json')};

  constructor(private http: HttpClient,
              private authService:AuthService) { }

  public placeOrder(orderId:number):Observable<any> {
    let orderDto = {userId: this.authService.userId, orderId:orderId };
    return this.http.post(`${environment.backend_orders}/customer/placeOrder`, orderDto);
  }

  public getOrdersByUserId():Observable<any> {
    let userId = this.authService.userId;
    return this.http.get(`${environment.backend_orders}/customer/myOrders/${userId}`);
  }

  public getCartByOrderId(orderId:number) {
    return this.http.get(`${environment.backend_cart}/cart-detail/${orderId}`);
  }

  public getQrCodeById(id:number) {
    return this.http.get(`${environment.backend_cart}/qrCode/${id}`);
  }

  public readQrCode(image:any) {
    return this.http.post(`${environment.backend_cart}/decryptQrCode`, image);
  }

  public decryptKeyInQrCode(decryptDto: DecryptDto ){
    return this.http.post(`${environment.backend_cart}/decryptKeyInQrCode`, decryptDto);
  }

  public getUserByEmail(email:string):Observable<any> {
    return this.http.get(`${environment.backend_user}/users-email/${email}`);
  }

  public editUser(user:User) {
    return this.http.put(`${environment.backend_user}/users-edit`, user, this.options);
  }

  deleteAccount(email:any) {
    return this.http.delete(`${environment.backend_user}/delete-user/${email}`);
  }


}
