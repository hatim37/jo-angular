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
  MatCardImage,
  MatCardTitle
} from '@angular/material/card';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { ConditionsOfUseComponent } from './conditions-of-use/conditions-of-use.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ProductComponent } from './product/product.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { CaddyComponent } from './caddy/caddy.component';

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
    CaddyComponent
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
