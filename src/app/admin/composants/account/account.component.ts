import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {AdminService} from '../../services/admin.service';
import {MatTableDataSource} from '@angular/material/table';
import {SnackbarService} from '../../../services/snackbar.service';
import {DeleteDialogComponent} from '../../../dialog/delete-dialog/delete-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

type ColKey = 'id'|'name'|'username'|'email'|'active'|'roles'|'action';

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit{
  mode = 0;
  editUserId: number | null = null;
  loading = false;
  error?: string;
  allUsers: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  valueBackend: any;
  messageError: any;


  // Non des colonnes
  displayCols: { key: ColKey; label: string; show: boolean }[] = [
    { key: 'id',       label: 'ID',       show: true },
    { key: 'name',     label: 'Nom',      show: true },
    { key: 'username', label: 'Prénom',   show: true },
    { key: 'email',    label: 'Email',    show: true },
    { key: 'active',   label: 'Active',   show: true },
    { key: 'roles',    label: 'Rôles',    show: true },
    { key: 'action',   label: 'Action',   show: true },
  ];

  get displayedColumns(): ColKey[] {
    return this.displayCols.filter(c => c.show).map(c => c.key);
  }

  allRoles = [
    { id: 1, name: 'ADMIN' },
    { id: 2, name: 'USER' },
    { id: 3, name: 'AGENT' }
  ];


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminService: AdminService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  labelOf(key: ColKey): string {
    return this.displayCols.find(c => c.key === key)?.label ?? key;
  }

  onToggleCols(): void {
    // force le rafraîchissement de la table
    this.dataSource._updateChangeSubscription();
  }

  onFilter(ev: Event): void {
    const value = (ev.target as HTMLInputElement).value ?? '';
    this.dataSource.filter = value.trim().toLowerCase();
  }

  getAllUsers(): void {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (data: any[]) => {
        this.loading = false;
        this.allUsers = data;
        this.dataSource = new MatTableDataSource(this.allUsers);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => {
        this.loading = false;
        this.messageError = err;
        this.snackBar.open('impossible de charger les utilisateurs', 'close', {duration: 3000, panelClass: 'error-snackbar'});
      }
    });
  }

  getRoleNames(roles: any[]): string[] {
    return roles.map(r => r.name);
  }

  onRolesChange(user: any, selectedNames: string[]): void {
    user.roles = this.allRoles.filter(role => selectedNames.includes(role.name));
    const roleNames = user.roles.map((r: any) => r.name);

    setTimeout(() => {
      this.adminService.addRoles(user.id, { roleNames }).subscribe({
        next: (value: any) => {
          this.valueBackend = value;
          this.getAllUsers();
          this.snackBar.open(this.valueBackend.body, 'close', { duration: 3000, panelClass: 'success-snackbar' });
        },
        error: (err: any) => {
          this.messageError = err;
          this.snackBar.open(err.error, 'close', { duration: 3000, panelClass: 'success-snackbar' });
        }
      });
    }, 1500);
  }

  editUser(id: number): void {
    this.mode = 1;
    this.editUserId = id;
  }

  deleteAccount(email: string): void {
    if (email == "admin@admin.com") {
      return
    }
    const dialogRef = this.dialog.open(DeleteDialogComponent,{
      data: { message: `Supprimer le compte ${email} ?` }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.deleteAccount(email).subscribe({
          next: value => {
            this.valueBackend = value;
            this.snackBar.open(this.valueBackend.body, 'close', { duration: 3000, panelClass: 'success-snackbar' });
            this.getAllUsers();
          },
          error: (err: any) => {
            this.snackbarService.openValidationDialog(err.error, 403, 5000, '/login', 'red');
          }
        });
      }
    });
  }
}
