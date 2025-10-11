import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient){
  }

  public getAllProducts():Observable<any> {
    return this.http.get(`${environment.backend_products}/products`);
  }

}
