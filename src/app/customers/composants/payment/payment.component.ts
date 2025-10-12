import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {CartService} from '../../../services/cart.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {CustomerService} from '../../services/customer.service';


interface Card {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-payment',
  standalone: false,
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {

  paymentForm!: FormGroup;

  cards: Card[] = [
    {value: 'visa-0', viewValue: 'Visa'},
    {value: 'mCard-1', viewValue: 'MasterCard'},
    {value: 'aExpress-2', viewValue: 'American Express'},
  ];


  constructor(public dialog: MatDialog,
              private fb: FormBuilder,
              private customerService: CustomerService,
              private cartService : CartService,
              public snackBar: MatSnackBar,
              private router:Router,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      card:['', Validators.required],
      number: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      date: [null, Validators.required],
      verif: [null, Validators.required]
    })
  }

  onSubmit() {
    this.customerService.placeOrder(this.data).subscribe({
      next: (data: any) => {
        if(data){
          this.snackBar.open('Commande validée', 'close', {duration: 3000, panelClass: 'success-snackbar'});
          this.router.navigate(['/customers/commandes']);
          this.closeForm();
          this.cartService.getSizeCaddy();
        } else {
          this.snackBar.open('échec, veuillez rééssayer', 'close', {duration: 3000, panelClass: 'error-snackbar'});
        }
      }, error: (err: any) => {

      }
    })
  }

  closeForm(): void {
    this.dialog.closeAll();
  }

}
