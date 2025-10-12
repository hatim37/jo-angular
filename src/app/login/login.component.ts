import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../services/snackbar.service';
import {CaddiesService} from '../services/caddies.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  mode:number=0;
  loginForm!: FormGroup;
  passwordForm!: FormGroup;
  hidePassword = true;
  messageError!:string;
  valueBackend:any;
  optionError: any;


  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private snackbarService:SnackbarService) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9._%+-]{2,}[.][A-Za-z]{2,}$')]],
      password: ['', Validators.required],
    })
    this.passwordForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9._%+-]{2,}[.][A-Za-z]{2,}$')]],
    })
  }


  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    let email = this.loginForm.value.email;
    let password =this.loginForm.value.password;

    this.authService.login(email, password).subscribe({
      next: value => {
        this.valueBackend = value;
        //on charge les informations depuis le token + archive du token en storage
        this.authService.loadProfile(value);

        this.snackbarService.openValidationDialog("Authentification réussie", 200, 1500,this.authService.roles?.includes('ADMIN') ? '/' : '/', 'green');

      }, error: (err: any) => {
        this.messageError = err.error.error;
        this.optionError = err.error.option;
        if(this.messageError == "Compte non activé" || this.messageError == "Nouvel appareil détecté"){
          this.router.navigate(['/validation'], {
            state: { email: email, optionId : this.optionError, message: this.messageError, uuid: err.error.uuid}
          });
        }
      }
    });
  }

}
