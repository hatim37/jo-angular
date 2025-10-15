import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {User} from '../model/user.model';
import {SnackbarService} from '../services/snackbar.service';


@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  hidePassword = true;
  password: string = '';
  isLengthValid: boolean = false;
  hasUpperCase: boolean = false;
  hasNumber: boolean = false;
  valueBackend: any;
  submitting = false;

  constructor(private fb: FormBuilder,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private router: Router,
              private snackbarService: SnackbarService,) {
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[\s'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/)]],
      username: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[\s'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/)]],
      email: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9._%+-]{2,}[.][A-Za-z]{2,}$')]],
      password: [null, [Validators.required, Validators.minLength(7), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{7,}$/)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(7), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{7,}$/)]],
      acceptTerms:  [false, Validators.requiredTrue]
    })
    this.signupForm.get('password')?.valueChanges.subscribe(() => {
      this.validatePassword();
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    let user= new User();
    user.name = this.signupForm.value.name;
    user.username = this.signupForm.value.username;
    user.email = this.signupForm.value.email;
    user.password = this.signupForm.value.password;

    //on vérifie que le password correspond bien au confirmPassword
    if (this.signupForm.value.password !== this.signupForm.value.confirmPassword) {
      this.snackBar.open('les mots de passe ne sont pas identiques', 'close', {duration: 3000, panelClass: 'error-snackbar'});
      return
    }
    this.submitting = true;
    this.authService.register(user).subscribe({
      next: (value: any) => {
        this.valueBackend=value;
        this.snackbarService.openValidationDialog("Votre compte est créer !", 201, 2000,'/', 'green');
        if(this.valueBackend.body.message == "validation"){
          this.router.navigate(['/validation'], {
            state: { email: this.signupForm.value.email, optionId: this.valueBackend.body.id, message: "Activez votre compte" },
          });
        }
        this.submitting = false;
      }, error: (err: any) => {
        this.snackbarService.openValidationDialog(err.error.error, err.status, 5000,'/', 'red');
        this.submitting = false;
      }
    });
  }

  validatePassword() {
    const pwd = this.signupForm.get('password')?.value || '';
    this.isLengthValid = pwd.length >= 7;
    this.hasUpperCase = /[A-Z]/.test(pwd);
    this.hasNumber = /\d/.test(pwd);
  }

}
