import { Injectable } from '@angular/core';
import {Caddy} from '../model/caddy.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Product} from '../model/product.model';
import {ItemProduct} from '../model/item-product.model';

@Injectable({
  providedIn: 'root'
})
export class CaddiesService {

  private readonly storageKey = 'panier';
  public caddy: Caddy;

  constructor(private snackBar: MatSnackBar) {
    this.caddy = this.loadCaddy() || new Caddy('Panier');
    this.saveCaddy();
  }

  public addProductToCaddy(product: Product, option:string, quantity:number) {
    let item = this.caddy.items.get(product.id);
    if (item !== undefined && option == "add") {
      // @ts-ignore
      item.quantity += quantity;
      this.snackBar.open('Quantité ajoutée dans le panier', 'close', {duration: 3000});
      this.saveCaddy();
    } else if (item !== undefined && option == "remove") {
      // @ts-ignore
      item.quantity -= product.quantity;
      this.snackBar.open('Quantité supprimée du panier', 'close', {duration: 3000});
      this.saveCaddy();
    }else {
      item = new ItemProduct();
      item.price = product.price;
      item.quantity = quantity;
      item.product = product;
      this.caddy.items.set(product.id, item);

      this.snackBar.open('Produit ajouté dans le panier', 'close', {duration: 3000});
      this.saveCaddy();
    }

  }

  public removeProductFromCaddy(productId: number) {
    if (this.caddy.items.has(productId)) {
      this.caddy.items.delete(productId);
      this.saveCaddy();
    }
  }

  public clearCaddy() {
    this.caddy.items.clear();
    this.saveCaddy();
  }

  public getCurrentCaddy(): Caddy {
    return this.caddy;
  }


  public getTotalCaddy() {
    let totalQuantity = 0;
    this.caddy.items.forEach((item: any) => {
      totalQuantity += item.quantity || 0;
    });
    return totalQuantity;

  }


  public getTotal(): number {
    let total = 0;
    for (let item of this.caddy.items.values()) {
      // @ts-ignore
      total += item.price * item.quantity;
    }
    return total;
  }

  public saveCaddy() {
    const serialized = JSON.stringify({...this.caddy, items: Array.from(this.caddy.items.entries())});
    localStorage.setItem(this.storageKey, serialized);
  }

  public loadCaddy(): Caddy | null {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      const parsed = JSON.parse(data);
      return {...parsed, items: new Map<number, ItemProduct>(parsed.items)
      };
    }
    return null;
  }

}

