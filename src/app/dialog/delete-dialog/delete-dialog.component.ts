import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  standalone: false,
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.css'
})
export class DeleteDialogComponent {

  constructor(private dialog:MatDialog, @Inject(MAT_DIALOG_DATA) public data: { message: string }) {
  }

  closeForm(): void {
    this.dialog.closeAll();
  }
}
