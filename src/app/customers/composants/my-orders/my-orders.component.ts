import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {AuthService} from '../../../services/auth.service';
import {CustomerService} from '../../services/customer.service';

interface Order {
  id: number;
  trackingId: string;
  amount: number;
  date: string | Date;
  orderStatus: string;
}


@Component({
  selector: 'app-my-orders',
  standalone: false,
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent implements OnInit{
  orders: Order[] = [];
  pagedOrders: Order[] = [];
  loading = false;
  error?: string;
  pageSize = 6;
  pageIndex = 0;
  pageSizeOptions = [6, 12, 24];

  constructor(
    public customerService: CustomerService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.loading = true;
    this.customerService.getOrdersByUserId().subscribe({
      next: (data: Order[]) => {
        // tri par date décroissante
        this.orders = [...data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.pageIndex = 0;
        this.updatePage();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Impossible de charger vos commandes.';
        this.loading = false;
      }
    });
  }

  onPage(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.updatePage();
  }

  private updatePage() {
    const start = this.pageIndex * this.pageSize;
    this.pagedOrders = this.orders.slice(start, start + this.pageSize);
  }

  statusClass(status: string) {
    const s = (status || '').toLowerCase();
    if (['paid', 'validée', 'validee'].includes(s)) return 'chip-success';
    if (['pending', 'en cours'].includes(s))       return 'chip-warn';
    if (['cancelled', 'annulée', 'annulee'].includes(s)) return 'chip-accent';
    return 'chip-default';
  }

  trackById(_: number, o: Order) { return o.id; }
}
