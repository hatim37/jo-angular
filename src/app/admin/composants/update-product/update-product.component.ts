import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AdminService} from '../../services/admin.service';

@Component({
  selector: 'app-update-product',
  standalone: false,
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent implements OnInit {

  productForm!: FormGroup;
  selectedFile: File | any;
  imagePreview: string | ArrayBuffer | any;
  existingImage:string | null = null;
  imgChanged = false;

  constructor(private router: Router, private fb: FormBuilder, private snackBar: MatSnackBar, private adminService: AdminService,
              private activatedRoute: ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      fileName: [null],
    });
    this.getProductById();
  }

  getProductById(){
    this.adminService.getProductById(this.activatedRoute.snapshot.params['productId']).subscribe({
      next: data => {
        this.productForm.patchValue(data);
        this.existingImage = 'data:image/jpeg;base64,' + data.byteImg;
      }
    })
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.previewImage();
    this.imgChanged = true;
    this.existingImage = null;
  }

  private previewImage() {
    let reader = new FileReader();
    reader.onload = (event: Event) => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(this.selectedFile);
    this.productForm.patchValue({fileName: this.selectedFile.name});
  }


  updateProduct() {
    if (this.productForm.valid) {
      let formData = new FormData();
      if(this.imgChanged && this.selectedFile){
        formData.append('img', this.selectedFile);
      }
      formData.append('name', this.productForm.value.name);
      formData.append('price', this.productForm.value.price);
      formData.append('description', this.productForm.value.description);

      this.adminService.updateProduct(this.activatedRoute.snapshot.params['productId'],formData).subscribe({
        next: data => {
          if (data) {
            this.snackBar.open('Product modifié !', 'close', {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
            this.router.navigate(['/admin/dashboard']);
          }
        }, error: (err: any) => {
          this.snackBar.open('création échouée, réessayer'+err, 'close', {duration: 3000, panelClass: 'error-snackbar'});
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
