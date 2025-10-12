import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {SnackbarService} from '../services/snackbar.service';


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
  uuid: any;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private snackbarService: SnackbarService,
              private router: Router,) {
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
    //on valide le code
    this.authService.validation({code: this.loginForm.value.code}).subscribe({
      next: value => {

        //appel login si authentification d'appareil
        if (this.messageError == "Nouvel appareil détecté") {
          this.authService.loginValidation(this.uuid).subscribe({
            next: value => {
              //on charge les informations depuis le token + archive du token en storage
              this.authService.loadProfile(value);
              this.snackbarService.openValidationDialog("Authentification réussie", 200, 1500, '/', 'green');
            }, error: error => {
              this.router.navigate(['/login']);
            }
          })
        } else {
          this.snackbarService.openValidationDialog("Votre compte est activé !", 200, 1500,'/login', 'green');
        }

      }, error: (err: any) => {
        this.snackbarService.openValidationDialog(err.error, 403, 5000, '/login', 'red');
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
    this.authService.sendNewCode({id: +this.optionId}).subscribe({
      next: (value: any) => {
        this.valueBackend = value;
        this.snackbarService.openValidationDialog(this.valueBackend.body, 201, 5000, '/', 'green');
      }, error: (err: any) => {
        this.snackbarService.openValidationDialog("Service indisponible", 201, 3000, '/', 'red');
      }
    });
  }

}
