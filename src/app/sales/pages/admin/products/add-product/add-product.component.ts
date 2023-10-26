import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryDto } from 'src/app/sales/interfaces/categoryDto-interface';
import { ProductDto } from 'src/app/sales/interfaces/productDto-interface';
import { CategoryService } from 'src/app/sales/services/category.service';
import { ProductService } from 'src/app/sales/services/product.service';
import { ValidatorService } from 'src/app/utils/service/validator.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit,OnDestroy {
  
  private productService = inject(ProductService);

  private categoryService = inject(CategoryService);

  private validatorService = inject(ValidatorService);

  public subscription$ = new Subscription();

  private fb = inject(FormBuilder);

  public categories: CategoryDto[] = [];

  public myFormProduct: FormGroup = this.fb.group({
    id: 0,
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    active: [false, []],
    price: ['', [Validators.required]],
    file: ['', [Validators.required]],
    category: ['',[Validators.required]],
  });

  public selectedFile: File | undefined;

  public imageUrl: string | undefined;

  ngOnInit(): void {
    this.loadCategories();
  }

  get currentProduct(): ProductDto {
    return this.myFormProduct.value as ProductDto;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const allowedFormats = ['image/jpeg', 'image/png'];
      if (allowedFormats.includes(file.type)) {
        this.imageUrl = URL.createObjectURL(file);
        this.selectedFile = file;
      } else {
        // Swal.fire('Opps!','File not allowed','warning');
        console.error('No permitido');
        this.imageUrl = undefined;
        this.selectedFile = undefined;
      }
    }
  }

  saveProduct(): void {
    if (this.myFormProduct.invalid || !this.selectedFile) {
      this.myFormProduct.markAllAsTouched();
      return;
    }
    this.productService
      .saveProductToPhoto(this.currentProduct, this.selectedFile!)
      .subscribe({
        next: (a) => {
          console.log(a)
        },
        error:(e:HttpErrorResponse) =>{
            this.validatorService.showSnackBarForError(e);          }
      });
  }

  loadCategories(): void {
   this.subscription$ = this.categoryService.fetchAllCategory().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
    });
  }

  public isValidateField(field:string): boolean | null{
    return this.validatorService.isValidField(this.myFormProduct,field);
  }


  ngOnDestroy(): void {
    if(this.subscription$){
      this.subscription$.unsubscribe();
    }
  }
}
