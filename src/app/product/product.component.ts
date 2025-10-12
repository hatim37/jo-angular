import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

import {NgForm} from '@angular/forms';
import {ProductsService} from '../services/products.service';
import {Product} from '../model/product.model';
import {CaddiesService} from '../services/caddies.service';
import {AuthService} from '../services/auth.service';
import {CartService} from '../services/cart.service';

@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  loading: boolean = false;
  products: any;
  submitting = false;
  quantityMap: { [productId: number]: number } = {};
  private value: any;
  public errorGetProducts: boolean | undefined;
  loadingProducts: { [productId: string]: boolean } = {};

  constructor(private productService: ProductsService,
              private snackBar: MatSnackBar,
              private caddyService:CaddiesService,
              private authService: AuthService,
              private cartService:CartService) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(){
    this.loading = true;
    this.products = [];
    this.productService.getAllProducts().subscribe({
      next: (data: any[]) => {
        this.loading = false;
        // @ts-ignore
        data.forEach((p: { id: string | number; }) => this.quantityMap[p.id] = 1);
        data.forEach(
          (element: { processedImg: string; byteImg: string; }) =>{
            element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
            this.products.push(element);
          })
      },
      error: (err: { error: { error: string; }; }) => {
        this.errorGetProducts = true;
        this.loading = false;
        this.snackBar.open('impossible de charger les produits', 'close', {duration: 3000, panelClass: 'error-snackbar'});
      }
    })
  }

  onAddProductToCaddy(p: Product, option:string, quantity:number, form: NgForm){
    this.loadingProducts[p.id] = true;
    const qty = this.quantityMap[p.id] || 1;
    if(this.authService.authenticated){
      this.submitting = true;
      this.cartService.addToCart(p.id,"add", qty).subscribe({
        next : data => {
          this.value = data;
          this.snackBar.open(this.value.message, 'close', {duration: 3000});
          this.cartService.getSizeCaddy();
          this.quantityMap[p.id] = 1;
          form.resetForm({ quantity: 1 });
          this.submitting = false;
          this.loadingProducts[p.id] = false;
        },
        error: err => {
          this.snackBar.open('erreur, '+err.error.error, 'close', {duration: 3000, panelClass: 'error-snackbar'});
          this.submitting = false;
          this.loadingProducts[p.id] = false;
        }
      });
    } else {
      this.caddyService.addProductToCaddy(p, option,qty);
      form.resetForm({ quantity: 1 });
      this.loadingProducts[p.id] = false;
    }
  }

}
