import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {CustomerService} from '../../services/customer.service';
import {QrCodeComponent} from '../qr-code/qr-code.component';

@Component({
  selector: 'app-detail-product-order',
  standalone: false,
  templateUrl: './detail-product-order.component.html',
  styleUrl: './detail-product-order.component.css'
})
export class DetailProductOrderComponent implements OnInit {

  orderId:any;
  productList: any = [];
  public valueBackend:any;

  constructor(private activedRoute: ActivatedRoute,
              private customerService: CustomerService,
              public dialog: MatDialog,) {
  }

  ngOnInit(): void {
    this.getProductByOrderId();
  }


  getProductByOrderId(){
    this.productList = [];
    this.orderId = this.activedRoute.snapshot.params['orderId'];
    this.customerService.getCartByOrderId(this.orderId).subscribe({
      next: (data: any) => {
        this.valueBackend = data;
        this.valueBackend.cartItems.forEach((item: { processedImg: string; returnedImg: string; qrCodeImg:string; qrCode:string }) => {
          item.processedImg = 'data:image/jpeg;base64,' + item.returnedImg;
          item.qrCodeImg = 'data:image/png;base64,' + item.qrCode;
          this.productList.push(item);
        })
      }
    })
  }

  public openImage(itemId:number){
    this.dialog.open(QrCodeComponent, {
      data : itemId
    });
  }
}
