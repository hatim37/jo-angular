import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProductsService} from '../services/products.service';
import {Product} from '../model/product.model';
import {NgForm} from '@angular/forms';
import {CaddiesService} from '../services/caddies.service';

@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  loading: boolean = false;
  products: any;
  quantityMap: { [productId: number]: number } = {};
  public errorGetProducts: boolean | undefined;

  constructor(private productService: ProductsService,
              private snackBar: MatSnackBar,
              private caddyService:CaddiesService) { }

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
    const qty = this.quantityMap[p.id] || 1;
    this.caddyService.addProductToCaddy(p, option,qty);
    form.resetForm({ quantity: 1 });

  }

}

