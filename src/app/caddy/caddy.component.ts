import {Component, OnInit} from '@angular/core';
import {Product} from '../model/product.model';
import {CaddiesService} from '../services/caddies.service';

@Component({
  selector: 'app-caddy',
  standalone: false,
  templateUrl: './caddy.component.html',
  styleUrl: './caddy.component.css'
})
export class CaddyComponent implements OnInit {

  public caddy: any;
  public entries: any = [];
  public valueBackend:any;
  loading: boolean = false;

  constructor(public caddyService: CaddiesService) {
  }

  ngOnInit() {
    this.getCaddies();
  }

  public getCaddies() {
    this.caddy=this.caddyService.getCurrentCaddy().items;
    this.caddy.forEach((item: any) => {
      this.entries.push(item);
      this.entries.forEach((entry: any) => {})
    })
  }

  public removeProductFromCaddy(productId:number){
    this.caddyService.removeProductFromCaddy(productId);
    this.entries = [];
    this.caddyService.loadCaddy();
    this.getCaddies();
  }

  onAddProductToCaddy(p: Product, option:string) {
    this.caddyService.addProductToCaddy(p, option, 1);
  }

}
