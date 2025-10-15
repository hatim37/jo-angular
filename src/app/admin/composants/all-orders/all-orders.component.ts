import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AuthService} from '../../../services/auth.service';
import {MatTableDataSource} from '@angular/material/table';
import {AdminService} from '../../services/admin.service';

type ColumnKey = 'commande' | 'amount' | 'date' | 'status' | 'action';
@Component({
  selector: 'app-all-orders',
  standalone: false,
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.css'
})
export class AllOrdersComponent implements OnInit{
  loading = false;
  myOrders: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: ColumnKey[] = ['commande','amount','date','status','action'];
  error?: string;
  pagedOrders: any[] = [];        // ✅ commandes paginées pour mobile
  pageSizeMobile = 5;            // ✅ nombre d'éléments par page mobile
  currentPageMobile = 1;
  totalPagesMobile = 1;


  // Options de colonnes pour le filtre
  columnOptions: { key: ColumnKey; label: string; visible: boolean }[] = [
    { key: 'commande', label: 'Commande', visible: true },
    { key: 'amount',   label: 'Montant',  visible: true },
    { key: 'date',     label: 'Date',     visible: true },
    { key: 'status',   label: 'Status',   visible: true },
    { key: 'action',   label: 'Action',   visible: true }
  ];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(public adminService: AdminService, public authService: AuthService) {}

  ngOnInit(): void {
    this.getAllOrders();
    this.applyColumnVisibility();
  }

  getAllOrders(): void {
    this.loading = true;
    this.adminService.getAllOrders().subscribe({
      next: data => {
        this.loading = false;
        this.myOrders = data || [];
        this.dataSource = new MatTableDataSource(this.myOrders);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.currentPageMobile = 1;
        this.updatePagedOrders();
      },
      error: (err: any) => {
        this.error = 'Impossible de charger vos commandes.';
        this.loading = false;
      }
    });
  }

  filterCoupon(event: Event) {
    const value = (event.target as HTMLInputElement).value ?? '';
    this.dataSource.filter = value.trim().toLowerCase();
  }

  applyColumnVisibility() {
    const selected = this.columnOptions
      .filter(c => c.visible)
      .map(c => c.key) as ColumnKey[];

    this.displayedColumns = selected.length ? selected : ['commande'];
  }

  statusClass(status: string) {
    const s = (status || '').toLowerCase();
    if (['paid', 'validée', 'validee'].includes(s)) return 'chip-success';
    if (['pending', 'en cours'].includes(s))       return 'chip-warn';
    if (['cancelled', 'annulée', 'annulee'].includes(s)) return 'chip-accent';
    return 'chip-default';
  }

  //Pagination mobile
  updatePagedOrders() {
    this.totalPagesMobile = Math.ceil(this.myOrders.length / this.pageSizeMobile);
    const start = (this.currentPageMobile - 1) * this.pageSizeMobile;
    const end = start + this.pageSizeMobile;
    this.pagedOrders = this.myOrders.slice(start, end);
  }

  nextPageMobile() {
    if (this.currentPageMobile < this.totalPagesMobile) {
      this.currentPageMobile++;
      this.updatePagedOrders();
    }
  }

  prevPageMobile() {
    if (this.currentPageMobile > 1) {
      this.currentPageMobile--;
      this.updatePagedOrders();
    }
  }

}
