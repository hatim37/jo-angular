import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProductsService} from '../services/products.service';

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
  loadingProducts: { [productId: string]: boolean } = {};

  constructor(private productService: ProductsService,
              private snackBar: MatSnackBar) { }

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

  onAddProductToCaddy(){
  }

}

