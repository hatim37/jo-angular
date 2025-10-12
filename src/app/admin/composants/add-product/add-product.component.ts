import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AdminService} from '../../services/admin.service';

@Component({
  selector: 'app-add-product',
  standalone: false,
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {

  productForm!: FormGroup;
  selectedFile: File | null | any;
  imagePreview: string | ArrayBuffer | null | any;

  constructor(private router: Router, private fb: FormBuilder, private snackBar: MatSnackBar, private adminService: AdminService) {
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      fileName: ['', Validators.required],
    });
  }


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  private previewImage() {
    let reader = new FileReader();
    reader.onload = (event: Event) => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(this.selectedFile);
    this.productForm.patchValue({fileName: this.selectedFile.name});
  }


  addProduct() {
    if (this.productForm.valid) {
      let formData = new FormData();
      formData.append('name', this.productForm.value.name);
      formData.append('price', this.productForm.value.price);
      formData.append('description', this.productForm.value.description);
      formData.append('categoryId', this.productForm.value.categoryId);
      formData.append('img', this.selectedFile);

      this.adminService.addProduct(formData).subscribe({
        next: data => {
          if (data) {
            this.snackBar.open('Produit crée !', 'close', {duration: 3000, panelClass: 'success-snackbar'});
            this.router.navigate(['/admin/dashboard']);
          }
        }, error: (err: any) => {
          this.snackBar.open('création échouée, réessayer' + err, 'close', {duration: 3000, panelClass: 'error-snackbar'
          });
        }
      })
    } else {
      for (let i in this.productForm.controls) {
        this.productForm.controls[i].markAsDirty();
        this.productForm.controls[i].updateValueAndValidity();
      }
    }
  }
}
