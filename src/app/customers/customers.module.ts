import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { PaymentComponent } from './composants/payment/payment.component';
import { PlaceOrderComponent } from './composants/place-order/place-order.component';
import {MatCard, MatCardModule} from "@angular/material/card";
import {MatDivider} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogContent} from '@angular/material/dialog';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgxMaskDirective} from 'ngx-mask';
import { MyOrdersComponent } from './composants/my-orders/my-orders.component';
import {MatPaginator} from '@angular/material/paginator';
import { DetailProductOrderComponent } from './composants/detail-product-order/detail-product-order.component';
import { QrCodeComponent } from './composants/qr-code/qr-code.component';
import { ReadQrcodeComponent } from './composants/read-qrcode/read-qrcode.component';


@NgModule({
  declarations: [
    CustomersComponent,
    PaymentComponent,
    PlaceOrderComponent,
    MyOrdersComponent,
    DetailProductOrderComponent,
    QrCodeComponent,
    ReadQrcodeComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    MatCardModule,
    MatDivider,
    MatFormFieldModule,
    MatSelect,
    MatDialogContent,
    ReactiveFormsModule,
    MatInput,
    MatOption,
    MatButton,
    MatIcon,
    NgxMaskDirective,
    MatPaginator,
    MatIconButton,

  ]
})
export class CustomersModule { }
