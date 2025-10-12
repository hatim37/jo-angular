import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './customers.component';
import {PlaceOrderComponent} from './composants/place-order/place-order.component';
import {MyOrdersComponent} from './composants/my-orders/my-orders.component';
import {DetailProductOrderComponent} from './composants/detail-product-order/detail-product-order.component';


const routes: Routes = [
  { path: '', component: CustomersComponent },
  {path: 'details-commande', component: PlaceOrderComponent},
  {path: 'commandes', component: MyOrdersComponent},
  {path: 'product_list_order/:orderId', component: DetailProductOrderComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
