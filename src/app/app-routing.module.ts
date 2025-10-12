import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {PrivacyPolicyComponent} from './privacy-policy/privacy-policy.component';
import {ConditionsOfUseComponent} from './conditions-of-use/conditions-of-use.component';
import {ProductComponent} from './product/product.component';
import {CaddyComponent} from './caddy/caddy.component';
import {SignupComponent} from './signup/signup.component';
import {ValidationComponent} from './validation/validation.component';
import {LoginComponent} from './login/login.component';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';
import {AuthGuard} from './guards/auth.guard';
import {AuthorizationGuard} from './guards/authorization.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'politique-prive', component: PrivacyPolicyComponent},
  {path: 'conditions-utilisation', component: ConditionsOfUseComponent},
  {path: 'products', component: ProductComponent},
  {path: 'panier', component: CaddyComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'validation', component: ValidationComponent},
  {path: 'login', component: LoginComponent},
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'customers', canActivate:[AuthGuard], loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule) },
  { path: 'admin', canActivate:[AuthGuard, AuthorizationGuard], data: {roles: ['ADMIN']}, loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
