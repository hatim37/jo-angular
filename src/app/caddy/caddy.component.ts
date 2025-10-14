import {Component, OnInit} from '@angular/core';
import {CaddiesService} from '../services/caddies.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Product} from '../model/product.model';
import {CartService} from '../services/cart.service';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {BehaviorSubject, Subscription, take} from 'rxjs';

@Component({
  selector: 'app-caddy',
  standalone: false,
  templateUrl: './caddy.component.html',
  styleUrl: './caddy.component.css'
})
export class CaddyComponent implements OnInit {

  public caddy: any;
  public entries: any = [];
  public valueBackend:any;
  public loading: boolean = false;
  public submitting = false;
  public addBouton: boolean = false;
  public removeBouton: boolean = false;
  public errorGetCaddy: boolean = false;
  loadingAdd: { [id: number]: boolean } = {};
  loadingRemove: { [id: number]: boolean } = {};
  fromValidation=false;
  fromLogin=false;
  private cartUpdatedSub?: Subscription;

  constructor(public caddyService: CaddiesService,
              private cartService: CartService,
              private snackBar: MatSnackBar,
              public authService: AuthService,
              private router: Router,) {
  }

  ngOnInit(): void {
    // Vérifie si la navigation vient de Validation ou Login
    this.fromValidation = history.state?.fromValidation;
    this.fromLogin = history.state?.fromLogin;

    // éviter relance sur refresh
    if (this.fromValidation || this.fromLogin) {
      history.replaceState({}, '');
    }

    // Si on url from Validation ou Login
    if (this.fromValidation || this.fromLogin) {
      this.loading = true;

      // Vérifie si le CartService a déjà émis `true`
      const alreadyUpdated = (this.cartService as any).cartUpdatedSubject.getValue();
      if (alreadyUpdated) {
        this.getCartBackend();
        this.cartService.setCartUpdated(false);
      } else {
        // Sinon on attend l'événement cartUpdated$
        this.cartUpdatedSub = this.cartService.cartUpdated$
          .pipe(take(1))
          .subscribe((updated) => {
            if (updated) {
              this.getCartBackend();
              this.cartService.setCartUpdated(false);
            }
          });
      }
    }
    else {
      this.getCaddies();
    }
  }

  ngOnDestroy(): void {
    if (this.cartUpdatedSub) {
      this.cartUpdatedSub.unsubscribe();
    }
  }


  public getCaddies() {
    if(this.authService.authenticated){
      this.cartService.getSizeCaddy();
      if (!this.fromValidation && !this.fromLogin) {
        this.getCartBackend();
      }
    } else {
      this.caddy=this.caddyService.getCurrentCaddy();
      this.caddy.items.forEach((item: any) => {
        this.entries.push(item);
        this.entries.forEach((entry: any) => {})
      })
    }
  }

  public removeProductFromCaddy(productId:number){
    this.caddyService.removeProductFromCaddy(productId);
    this.entries = [];
    this.caddyService.loadCaddy();
    this.getCaddies();
  }

  onAddProductToCaddy(p: Product, option:string) {
    this.caddyService.addProductToCaddy(p, option, 1);
  }

  addToCartBackend(id:number,option:string, quantity:number) {
    //on active les animations spinner
    this.loading=true;
    if (option === 'add') {
      this.loadingAdd[id] = true;
    } else {
      this.loadingRemove[id] = true;
    }
    this.submitting = true;
    //on lance la requete vers le backend
    this.cartService.addToCart(id,option,quantity).subscribe({
      next : data => {
        this.cartService.getCartByUserId().subscribe({
          next: data => {
            this.valueBackend = data;
            this.entries = [];
            this.valueBackend.cartItems.forEach((item: { processedImg: string; returnedImg: string; }) => {
              item.processedImg = 'data:image/jpeg;base64,' + item.returnedImg;
              this.entries.push(item);
            })
            this.cartService.getSizeCaddy();
            this.snackBar.open('Quantité modifiée !', 'close', {duration: 3000});
            //on arrete les animations spinner
            this.loading = false;
            this.submitting = false;
            this.removeBouton = false;
            this.addBouton = false
            this.loadingAdd[id] = false;
            this.loadingRemove[id] = false;
          },error: (err: any) => {
            this.snackBar.open('Erreur, veuillez réessayer ', 'close', {duration: 3000, panelClass: 'error-snackbar'});
            this.loading = false;
            this.submitting = false;
            this.removeBouton = false;
            this.addBouton = false
            this.loadingAdd[id] = false;
            this.loadingRemove[id] = false;
          }
        })

      }
    });
  }


  getCartBackend() {
    this.loading=true;
    this.entries = [];
    this.cartService.getCartByUserId().subscribe({
      next: data => {
        this.loading=false;
        this.valueBackend = data;
        this.valueBackend.cartItems.forEach((item: { processedImg: string; returnedImg: string; }) => {
          item.processedImg = 'data:image/jpeg;base64,' + item.returnedImg;
          this.entries.push(item);
        })
      },
      error: err => {
        this.loading=false;
        this.errorGetCaddy = true
        this.snackBar.open('Erreur, veuillez réessayer', 'close', {duration: 3000, panelClass: 'error-snackbar'});
      }
    })
  }

  deleteCartItems(cartId: number) {
    this.cartService.deleteCartItems(cartId).subscribe({
      next: data => {
        this.getCaddies();
        this.cartService.getSizeCaddy();
        if (data == null) {
          this.snackBar.open('Produit supprimé', 'close', {
            duration: 3000,
            panelClass: 'error-snackbar'
          });
        }
      },
      error: err => {
        this.snackBar.open('erreur, '+err.error.error, 'close', {duration: 3000, panelClass: 'error-snackbar'});

      }
    })
  }

  placeOrder() {
    if (this.authService.authenticated){
      this.router.navigate(['/customers/details-commande']);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
