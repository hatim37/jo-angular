import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  options:any = {headers: new HttpHeaders().set('Content-Type', 'application/json')};

  constructor(private http: HttpClient) { }

  getAllUsers():Observable<any> {
    return this.http.get(`${environment.backend_user}/admin/users`);
  }

  addRoles(userId:number,roles:any):Observable<any> {
    return this.http.post(`${environment.backend_user}/admin/updateRoles/${userId}`, roles, this.options);
  }

  deleteAccount(email:any) {
    return this.http.delete(`${environment.backend_user}/delete-user/${email}`);
  }

  public addProduct(productDto:any){
    return this.http.post(`${environment.backend_products}/admin/new-product`, productDto);
  }

  public updateProduct(productId: number, productDto: FormData){
    return this.http.put(`${environment.backend_products}/admin/product/${productId}`, productDto);
  }
  public getProductById(productId:number):Observable<any> {
    return this.http.get(`${environment.backend_products}/admin/product/${productId}`);
  }

  public getAllProducts():Observable<any> {
    return this.http.get(`${environment.backend_products}/admin/products`);
  }


  public deleteProduct(productId:number): Observable<any> {
    return this.http.delete(`${environment.backend_products}/admin/delete-product/${productId}`);
  }

  public getAllOrders():Observable<any> {
    return this.http.get(`${environment.backend_orders}/admin/placedOrders`);
  }

  public getAnalytics():Observable<any> {
    return this.http.get(`${environment.backend_orders}/admin/order/analytics`);
  }

}
