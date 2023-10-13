import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductDto } from 'src/app/sales/interfaces/productDto-interface';
import { ProductService } from 'src/app/sales/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {

  private productService = inject(ProductService);

  private fb = inject(FormBuilder);

  public myFormProduct: FormGroup = this.fb.group({
    id: 0,
    name: ['', []],
    description: ['', []],
    isStock: [true, []],
    price: [0, []],
    category: [],
  });

  ngOnInit(): void {}

  get currentProduct(): ProductDto {
    return this.myFormProduct.value as ProductDto;
  }

  myForm(): void {
    if (this.myFormProduct.invalid) {
      this.myFormProduct.markAllAsTouched();
      return;
    }
    this.productService.saveProduct(this.currentProduct).subscribe({
      next:(a) =>{
        console.log(a);
      }
    });

  }
}
