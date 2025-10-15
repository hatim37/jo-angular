import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../services/snackbar.service';
import {CartService} from '../services/cart.service';
import {CaddiesService} from '../services/caddies.service';


@Component({
  selector: 'app-validation',
  standalone: false,
  templateUrl: './validation.component.html',
  styleUrl: './validation.component.css'
})
export class ValidationComponent implements OnInit {
  loginForm!: FormGroup;
  passwordForm!: FormGroup;
  mode: number = 0;
  email: string = '';
  optionId: string = '';
  messageError: string = '';
  valueBackend: any;
  isLengthValid: boolean = false;
  hasUpperCase: boolean = false;
  hasNumber: boolean = false;
  hidePassword = true;
  uuid: any;
  submitting: boolean = false;

  constructor(private fb: FormBuilder,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private router: Router,
              public dialog: MatDialog,
              private snackbarService: SnackbarService,
              private cartService: CartService,
              private caddyService: CaddiesService) {
  }


  ngOnInit(): void {
    //on recuperer le email saisi dans le formulaire précedent
    this.email = history.state['email'] || '';
    this.optionId = history.state['optionId'] || '';
    this.messageError = history.state['message'] || '';
    this.uuid = history.state['uuid'] || '';
    if (this.messageError == "Modifier votre mot de passe") {
      this.mode = 1;
    }
    //on initialise les formulaires
    this.loginForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    })
    this.passwordForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      password: [null, [Validators.required, Validators.minLength(7), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{7,}$/)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(7), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{7,}$/)]]
    })
  }

  onSubmit() {
    this.submitting = true;
    //on valide le code
    this.authService.validation({code: this.loginForm.value.code}).subscribe({
      next: value => {
        this.submitting = false;
        //appel login si authentification d'appareil
        if (this.messageError == "Nouvel appareil détecté") {
          this.authService.loginValidation(this.uuid).subscribe({
            next: value => {
              //on charge les informations depuis le token + archive du token en storage
              this.authService.loadProfile(value);
              this.cartService.getSizeCaddy();
              //recherche si panier pour envoi backend :
              if (this.caddyService.getCurrentCaddy().items.size > 0) {
                this.cartService.sendCaddyInBackend();
                this.snackbarService.openValidationDialog("Authentification réussie", 200, 1500, '/panier', 'green',{ fromValidation: true });
              } else {
                this.snackbarService.openValidationDialog("Authentification réussie", 200, 1500, '/', 'green');
              }

            }, error: error => {
              this.snackbarService.openValidationDialog("Échec authentification", 403, 1500, '/', 'red');
              this.router.navigate(['/login']);
            }
          })
        } else {
          this.snackbarService.openValidationDialog("Votre compte est activé", 200, 1500,'/login', 'green');
        }

      }, error: (err: any) => {
        this.snackbarService.openValidationDialog(err.error, 403, 5000, '/login', 'red');
        this.submitting = false;
      }
    });
  }

  //fonction qui impose uniquement des chiffres sur la saisie du champ code
  allowOnlyDigits(event: KeyboardEvent): void {
    const pattern = /[0-9]/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  sendNewCode() {
    this.submitting = true;
    this.authService.sendNewCode({id: +this.optionId}).subscribe({
      next: value => {
        this.submitting = false;
        this.valueBackend = value;
        this.snackbarService.openValidationDialog(this.valueBackend.body, 201, 5000, '/', 'green');
      }, error: (err: any) => {
        this.snackbarService.openValidationDialog("Service indisponible", 201, 3000, '/', 'red');
        this.submitting = false;
      }
    });
  }

  newPassword() {
    this.submitting = true;
    let code = this.passwordForm.value.code;
    let password = this.passwordForm.value.password;
    let confirmPassword = this.passwordForm.value.confirmPassword;
    //on vérifie que le password correspond bien au confirmPassword
    if (password !== confirmPassword) {
      this.snackBar.open('les mots de passe ne sont pas identiques', 'Fermer', {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
      return
    }
    this.authService.validation({code: code, password: password}).subscribe({
      next: value => {
        this.submitting = false;
        this.valueBackend = value;
        if (this.authService.authenticated) {
          this.snackbarService.openValidationDialog(this.valueBackend.body, this.valueBackend.statusCodeValue, 3000, '/customers/account', 'green');
        } else {
          this.snackbarService.openValidationDialog(this.valueBackend.body, this.valueBackend.statusCodeValue, 3000, '/login', 'green');
        }
      }, error: (err: any) => {
        this.snackbarService.openValidationDialog(err.error, err.status, 5000, '/', 'red');
        this.submitting = false;
      }
    });
  }

  //affiche condition d'un password
  validatePassword() {
    const pwd = this.passwordForm.get('password')?.value || '';
    this.isLengthValid = pwd.length >= 7;
    this.hasUpperCase = /[A-Z]/.test(pwd);
    this.hasNumber = /\d/.test(pwd);
  }

  //afficher le password saisi
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
