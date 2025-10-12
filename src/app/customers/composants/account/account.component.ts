import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {CustomerService} from '../../services/customer.service';
import {AuthService} from '../../../services/auth.service';
import {SnackbarService} from '../../../services/snackbar.service';
import {User} from '../../../model/user.model';
import {MatDialog} from '@angular/material/dialog';
import {DeleteDialogComponent} from '../../../dialog/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  UserForm!: FormGroup;
  isReadonly  = true;
  valueBackend: any;

  constructor(private router: Router, private fb: FormBuilder,
              private customerService: CustomerService,
              private authService: AuthService,
              private snackbarService:SnackbarService,
              private dialog: MatDialog,) {}

  ngOnInit(): void {
    this.UserForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: [''],
    });
    this.getUserById();
  }

  getUserById(){
    this.customerService.getUserByEmail(this.authService.email).subscribe({
      next: data => {
        this.UserForm.patchValue(data);
      }
    })
  }

  editUser(){
    let user= new User();
    user.id= this.authService.userId;
    user.name = this.UserForm.value.name;
    user.username = this.UserForm.value.username;

    this.customerService.editUser(user).subscribe({
      next: value => {
        this.valueBackend=value;
        this.authService.username = this.UserForm.value.username;
        this.snackbarService.openValidationDialog(this.valueBackend.body, 201, 2000,'/', 'green');
      }, error: (err: any) => {
        this.snackbarService.openValidationDialog(err.error.error, err.status, 5000,'/', 'red');
      }
    });
  }

  newPassword() {
    this.authService.editPassword({email:this.UserForm.value.email}).subscribe({
      next: value => {
        this.valueBackend = value;
        if (this.valueBackend.body.message == "validation") {
          this.router.navigate(['/validation'], {
            state: { email: this.UserForm.value.email, optionId : this.valueBackend.body.id, message: "Modifier votre mot de passe" }});
        }
      }, error: (err: any) => {
        this.snackbarService.openValidationDialog(err.error, 403, 5000,'/login', 'red');
      }
    });
  }

  deleteAccount() {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        message:"Voulez-vous vraiment supprimer votre compte ?"}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerService.deleteAccount(this.UserForm.value.email).subscribe({
          next: value => {
            this.valueBackend = value;
            this.authService.logout();
          }, error: (err: any) => {
            this.snackbarService.openValidationDialog(err.error, 403, 5000,'/login', 'red');
          }
        });
      }
    });
  }
}
