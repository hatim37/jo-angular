import {Injectable, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {SnackbarComponent} from '../snackbar/snackbar.component';


@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private dialog: MatDialog, private router: Router) {}

  openValidationDialog(message: string, statusCode: number, durationMs: number = 5000, url:string, color: 'red' | 'green' = 'green'): void {
    const dialogRef = this.dialog.open(SnackbarComponent, {
      data: { message, color },
      width: '400px',
      disableClose: true
    });

    setTimeout(() => dialogRef.close(), durationMs);

    dialogRef.afterClosed().subscribe(() => {
      if (statusCode === 200) {
        this.router.navigate([url]);
      }
    });
  }
}
