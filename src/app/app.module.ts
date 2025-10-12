import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {RouterModule} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDivider, MatListItem, MatNavList} from '@angular/material/list';
import {MatBadge} from '@angular/material/badge';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage, MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { ConditionsOfUseComponent } from './conditions-of-use/conditions-of-use.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ProductComponent } from './product/product.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { CaddyComponent } from './caddy/caddy.component';
import { SignupComponent } from './signup/signup.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatInput} from '@angular/material/input';
import {MatDialogActions, MatDialogClose, MatDialogContent} from '@angular/material/dialog';
import { ValidationComponent } from './validation/validation.component';
import { LoginComponent } from './login/login.component';
import {AppHttpInterceptor} from './interceptors/app-http.interceptor';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import {AuthGuard} from './guards/auth.guard';
import {AuthorizationGuard} from './guards/authorization.guard';
import {provideNgxMask} from 'ngx-mask';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {getFrPaginatorIntl} from './shared/custom-paginator-intl';

registerLocaleData(localeFr, 'fr-FR');
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    ConditionsOfUseComponent,
    PrivacyPolicyComponent,
    ProductComponent,
    CaddyComponent,
    SignupComponent,
    SnackbarComponent,
    ValidationComponent,
    LoginComponent,
    UnauthorizedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatNavList,
    MatListItem,
    MatBadge,
    MatDivider,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatCardImage,
    MatCardActions,
    FormsModule,
    HttpClientModule,
    MatProgressSpinner,
    MatFormFieldModule,
    MatCheckbox,
    ReactiveFormsModule,
    MatInput,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatCardSubtitle
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass:AppHttpInterceptor, multi:true},
    AuthGuard, AuthorizationGuard,
    {provide: LOCALE_ID, useValue: 'fr-FR'},
    provideNgxMask(),
    { provide: MatPaginatorIntl, useValue: getFrPaginatorIntl() }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
