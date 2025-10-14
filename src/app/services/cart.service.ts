import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {CaddiesService} from './caddies.service';
import {AddProductInCartDto} from '../model/AddProductInCartDto';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartUpdatedSubject = new BehaviorSubject<boolean>(false);
  cartUpdated$ = this.cartUpdatedSubject.asObservable();

  setCartUpdated(updated: boolean) {
    this.cartUpdatedSubject.next(updated);
  }


  options:any = {headers: new HttpHeaders().set('Content-Type', 'application/json')};
  public caddy: AddProductInCartDto[] | undefined;
  public entries: any = [];
  public sizeCaddyBackend:number =0;

  constructor(private authService: AuthService,
              private http: HttpClient,
              private caddyService: CaddiesService) {}



  sendCaddyInBackend(){
    const itemsMap =this.caddyService.getCurrentCaddy().items;
    this.caddy = Array.from(itemsMap.entries()).map(
      ([productId, entry]) => ({
        userId: this.authService.userId,
        productId: productId,
        option: 'add',
        quantity: entry.quantity!
      })
    );
    this.sendCaddy(this.authService.userId, this.caddy).subscribe({
      next: data => {
        this.getSizeCaddy();
        this.setCartUpdated(true);
        this.caddy = [];
        this.entries = [];
        this.getCartByUserId();
        this.caddyService.clearCaddy();
      },
      error: err => {
        this.setCartUpdated(true);
        console.error('Erreur lors de l\'envoi du panier', err);
      }
    });
  }

  public addToCart(productId:any, option:string, quantity:number) {
    let cartDto = {
      productId: productId,
      userId : this.authService.userId,
      option : option,
      quantity : quantity}
    return this.http.post(`${environment.backend_cart}/addCart`, cartDto, this.options);
  }

  public sendCaddy(userId: number,addProductInCartDto: AddProductInCartDto[]) {
    return this.http.post(`${environment.backend_cart}/addCaddy/${userId}`, addProductInCartDto, this.options);
  }

  public getCartByUserId() {
    let userId = this.authService.userId;
    return this.http.get(`${environment.backend_cart}/cart/${userId}`);
  }

  getSizeCaddy(): void {
    this.getCartByUserId().subscribe({
      next: (value: any) => {
        if (!value || !value.cartItems) {
          this.sizeCaddyBackend = 0;
          return;
        }
        const totalQuantity = value.cartItems.reduce(
          (acc: number, item: any) => acc + (item.quantity || 0),
          0
        );
        if (totalQuantity !== this.sizeCaddyBackend) {
          this.sizeCaddyBackend = totalQuantity;
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du panier :', err);
        this.sizeCaddyBackend = 0;
      }
    });
  }

  deleteCartItems(cartId: number) {
    return this.http.delete(`${environment.backend_cart}/delete-cart/${cartId}`);
  }

}
