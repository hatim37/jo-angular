import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import {DashboardComponent} from './composants/dashboard/dashboard.component';
import {AddProductComponent} from './composants/add-product/add-product.component';
import {UpdateProductComponent} from './composants/update-product/update-product.component';
import {AccountComponent} from './composants/account/account.component';
import {AllOrdersComponent} from './composants/all-orders/all-orders.component';
import {AnalyticsComponent} from './composants/analytics/analytics.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'update-product/:productId', component: UpdateProductComponent },
  { path: 'account', component: AccountComponent },
  { path: 'allOrders', component: AllOrdersComponent },
  { path: 'analytics', component: AnalyticsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
