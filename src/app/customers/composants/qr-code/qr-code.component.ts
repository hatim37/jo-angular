import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {CustomerService} from '../../services/customer.service';

@Component({
  selector: 'app-qr-code',
  standalone: false,
  templateUrl: './qr-code.component.html',
  styleUrl: './qr-code.component.css'
})
export class QrCodeComponent implements OnInit {
  public valueBackend: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog,
              private customerService: CustomerService,) {
  }

  ngOnInit(): void {
    this.getQrCodeById()
  }

  getQrCodeById() {
    this.customerService.getQrCodeById(this.data).subscribe({
      next: data => {
        this.valueBackend = data;
        this.valueBackend.qrCodeImg = 'data:image/png;base64,' + this.valueBackend.qrCode;
      }
    })
  }

  closeForm(): void {
    this.dialog.closeAll();
  }

}
