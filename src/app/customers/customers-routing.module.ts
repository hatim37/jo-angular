import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './customers.component';
import {PlaceOrderComponent} from './composants/place-order/place-order.component';

const routes: Routes = [
  { path: '', component: CustomersComponent },
  {path: 'details-commande', component: PlaceOrderComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
