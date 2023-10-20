import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryDto } from 'src/app/sales/interfaces/categoryDto-interface';
import { ProductDto } from 'src/app/sales/interfaces/productDto-interface';
import { CategoryService } from 'src/app/sales/services/category.service';
import { ProductService } from 'src/app/sales/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  private productService = inject(ProductService);

  private categoryService = inject(CategoryService);

  private fb = inject(FormBuilder);

  public categories: CategoryDto[] = [];

  public myFormProduct: FormGroup = this.fb.group({
    id: 0,
    name: ['', []],
    description: ['', []],
    active: [false, []],
    price: [0, []],
    category: [''],
  });

  public selectedFile: File | undefined;

  public imageUrl: string | undefined;

  public isImageSelected: boolean = false;

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
        this.isImageSelected = true;
      } else {
        // Swal.fire('Opps!','File not allowed','warning');
        console.error('No permitido');
        this.imageUrl = undefined;
        this.selectedFile = undefined;
        this.isImageSelected = false;
      }
    }
  }

  saveProduct(): void {
    if (this.myFormProduct.invalid || !this.selectedFile) {
      this.myFormProduct.markAllAsTouched();
      return;
    }
    this.productService
      .saveProductToPhoto(this.currentProduct, this.selectedFile)
      .subscribe({
        next: (a) => {
          console.log(a);
        },
      });
  }

  loadCategories(): void {
    this.categoryService.fetchAllCategory().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
    });
  }
}
