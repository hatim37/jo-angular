import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-validation-dialog',
  templateUrl: './validation-dialog.component.html',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    NgStyle
  ],
  styleUrl: './validation-dialog.component.css'
})
export class ValidationDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string, color: string }) {
  }

}
