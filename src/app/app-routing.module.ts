import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {PrivacyPolicyComponent} from './privacy-policy/privacy-policy.component';
import {ConditionsOfUseComponent} from './conditions-of-use/conditions-of-use.component';
import {ProductComponent} from './product/product.component';
import {CaddyComponent} from './caddy/caddy.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'politique-prive', component: PrivacyPolicyComponent},
  {path: 'conditions-utilisation', component: ConditionsOfUseComponent},
  {path: 'products', component: ProductComponent},
  {path: 'panier', component: CaddyComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
