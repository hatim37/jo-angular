import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {AdminService} from '../../services/admin.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Product} from '../../../model/product.model';
import {AuthService} from '../../../services/auth.service';
import {CartService} from '../../../services/cart.service';
import {CaddiesService} from '../../../services/caddies.service';
import {DeleteDialogComponent} from '../../../dialog/delete-dialog/delete-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  public products: any[] | any;
  public searchProductionForm!: FormGroup;
  private value: any;
  submitting = false;
  quantityMap: { [productId: number]: number } = {};
  public errorGetProducts: boolean | undefined;
  loading: boolean = false;
  loadingProducts: { [productId: string]: boolean } = {};

  constructor(private adminService: AdminService,
              private fb: FormBuilder,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private cartService: CartService,
              private caddyService: CaddiesService,
              private dialog: MatDialog,) {
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.searchProductionForm = this.fb.group({
      title: ['', Validators.required]
    })
  }

  getAllProducts() {
    this.loading = true;
    this.products = [];
    this.adminService.getAllProducts().subscribe({
      next: data => {
        this.loading = false;
        // @ts-ignore
        data.forEach((p: { id: string | number; }) => this.quantityMap[p.id] = 1);
        data.forEach((element: { processedImg: string; byteImg: string; }) => {
          element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
          this.products.push(element);
        })
      },
      error: err => {
        this.errorGetProducts = true;
        this.loading = false;
        this.snackBar.open('impossible de charger les produits', 'close', {duration: 3000, panelClass: 'error-snackbar'
        });
      }
    })
  }



  deleteProduct(productId: number) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        message:"Etes vous sûr de supprimer ce produit ?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.deleteProduct(productId).subscribe({
          next: data => {
            this.getAllProducts()
            if (data == null) {
              this.snackBar.open('Produit supprimé', 'close', {duration: 3000, panelClass: 'error-snackbar'});
            }
          },
          error: err => {
            this.snackBar.open('erreur, '+err.error.error, 'close', {duration: 3000, panelClass: 'error-snackbar'});
          }
        })
      }
    });
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
