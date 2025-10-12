import {Component, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {CaddiesService} from '../services/caddies.service';
import {AuthService} from '../services/auth.service';
import {CartService} from '../services/cart.service';
import {MatDrawer} from '@angular/material/sidenav';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  public value: any;
  public drawerMode: 'side' | 'over' = 'side';
  public drawerOpened = true;
  public isDesktop = true;


  constructor(private bpo: BreakpointObserver,
              public caddiesService: CaddiesService,
              public authService: AuthService,
              public cartService: CartService,) {

    this.bpo.observe('(max-width: 768px)').subscribe(state => {
      if (state.matches) {
        // Mobile
        this.drawerMode = 'over';
        this.drawerOpened = false;
        this.isDesktop = false;
      } else {
        // Desktop
        this.drawerMode = 'side';
        this.drawerOpened = true;
        this.isDesktop = true;
      }
    });

  }

  ngOnInit(): void {
    if (this.authService.authenticated) {
      this.cartService.getSizeCaddy();
    }

    this.authService.loginSuccess.subscribe(() => {
      if (this.drawer && this.isDesktop) {
        this.drawer.close().then(() => setTimeout(() => this.drawer.open(), 150));
      }
    });

    this.authService.logoutSuccess.subscribe(() => {
      if (this.drawer && this.isDesktop) {
        this.drawer.close().then(() => setTimeout(() => this.drawer.open(), 150));
      }
    });

  }

  logout() {
    this.authService.logout();
  }

}
