import {Component, OnInit} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {CaddiesService} from '../services/caddies.service';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  public value: any;
  public drawerMode: 'side' | 'over' = 'side';
  public drawerOpened = true;

  constructor(private bpo: BreakpointObserver, public caddiesService: CaddiesService, public authService: AuthService) {
    this.bpo.observe('(max-width: 768px)').subscribe(state => {
      if (state.matches) {
        // Mobile : drawer en superposition et fermé par défaut
        this.drawerMode = 'over';
        this.drawerOpened = false;
      } else {
        // Desktop : drawer sur le côté et ouvert
        this.drawerMode = 'side';
        this.drawerOpened = true;
      }
    });
  }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
  }

}
