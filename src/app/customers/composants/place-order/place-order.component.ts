import {Component, OnInit} from '@angular/core';
import {PaymentComponent} from '../payment/payment.component';
import {AuthService} from '../../../services/auth.service';
import {CartService} from '../../../services/cart.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-place-order',
  standalone: false,
  templateUrl: './place-order.component.html',
  styleUrl: './place-order.component.css'
})
export class PlaceOrderComponent implements OnInit {

  public entries: any = [];
  public valueBackend:any;
  public date:Date = new Date();
  public loading:boolean = false;
  public errorGetCart: boolean= false;

  constructor(protected authService: AuthService,
              private cartService: CartService,
              public dialog: MatDialog,
              public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getCartBackend();
  }

  getCartBackend() {
    this.loading = true;
    this.entries = [];
    this.cartService.getCartByUserId().subscribe({
      next: data => {
        this.loading = false;
        this.valueBackend = data;
        this.valueBackend.cartItems.forEach((item: { processedImg: string; returnedImg: string; qrCodeImg:string; qrCode:string }) => {
          item.processedImg = 'data:image/jpeg;base64,' + item.returnedImg;
          item.qrCodeImg = 'data:image/png;base64,' + item.qrCode;
          this.entries.push(item);
        })
      },
      error: (err) => {
        this.errorGetCart = true;
        this.loading = false;
        this.snackBar.open('impossible de charger vos articles', 'close', {duration: 3000, panelClass: 'error-snackbar'});
      }
    })
  }

  payOrder(orderId:number) {
    this.dialog.open(PaymentComponent, {
      disableClose: true,
      data : orderId
    });

  }
}
