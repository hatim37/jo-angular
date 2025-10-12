import {Component, OnInit} from '@angular/core';
import {DecryptDto} from '../../../model/decryptDto.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerService} from '../../services/customer.service';
import {SnackbarService} from '../../../services/snackbar.service';

@Component({
  selector: 'app-read-qrcode',
  standalone: false,
  templateUrl: './read-qrcode.component.html',
  styleUrl: './read-qrcode.component.css'
})
export class ReadQrcodeComponent implements OnInit {

  readCodeForm!: FormGroup;
  selectedFile: File | any;
  imagePreview: string | ArrayBuffer | null | undefined;
  valueFromQrCode: any;
  codeDecrypty: any;
  messageError:any;
  messageErrorFormat: string | undefined;

  constructor(private fb: FormBuilder,
              private customerService:CustomerService,
              private snackbarService: SnackbarService,) {
  }

  ngOnInit(): void {
    this.readCodeForm = this.fb.group({
      fileName: ['', Validators.required],
    });
  }

  onFileSelected(event: any) {
    this.codeDecrypty = undefined;
    this.messageError = undefined;
    this.valueFromQrCode = undefined;

    const file: File = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/pjpeg'];
    if (!allowedTypes.includes(file.type)) {
      this.messageErrorFormat = 'Format de fichier non supporté. Veuillez sélectionner un PNG ou JPEG.';
      this.readCodeForm.patchValue({ fileName: '' });
      this.selectedFile = undefined;
      this.imagePreview = undefined;
      return;
    }
    this.selectedFile = file;
    this.previewImage();
  }

  private previewImage() {
    let reader = new FileReader();
    reader.onload = (event: Event) => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(this.selectedFile);
    this.readCodeForm.patchValue({fileName: this.selectedFile.name});
  }


  readCode() {
    if (this.readCodeForm.valid) {
      let formData = new FormData();
      formData.append('img', this.selectedFile);
      this.customerService.readQrCode(formData).subscribe({
        next: (data: any) => {
          if (data) {
            this.valueFromQrCode = data;
          }
        }, error: (err: any) => {
          if (err.error.error === "Le fichier fourni n'est pas valide" ||
            err.error.error ==="Le fichier QR code est vide ou null" ||
            err.error.error ==="Le fichier ne contient pas de QR code"){
            this.snackbarService.openValidationDialog(err.error.error, 403, 5000, '/', 'red');
          }else {
            this.snackbarService.openValidationDialog("Échec, veuillez réessayer", 403, 5000, '/', 'red');
          }
        }
      })
    } else {
      for (let i in this.readCodeForm.controls) {
        this.readCodeForm.controls[i].markAsDirty();
        this.readCodeForm.controls[i].updateValueAndValidity();
      }
    }
  }

  testCode() {
    let decryptDto = new DecryptDto();
    decryptDto.userId = this.valueFromQrCode.client;
    decryptDto.orderId = this.valueFromQrCode.commande;
    decryptDto.inputCode = this.valueFromQrCode.code;
    this.customerService.decryptKeyInQrCode(decryptDto).subscribe({
      next:(data: any) => {
        this.codeDecrypty = data
      }, error: (err: any) => {
        this.messageError = "Code de sécurité invalide";

      }
    })
  }
}
