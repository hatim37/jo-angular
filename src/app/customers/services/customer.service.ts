import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient,
              private authService:AuthService) { }

  public placeOrder(orderId:number):Observable<any> {
    let orderDto = {userId: this.authService.userId, orderId:orderId };
    return this.http.post(`${environment.backend_orders}/customer/placeOrder`, orderDto);
  }


}
