import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoryDto } from 'src/app/sales/interfaces/categoryDto-interface';
import { CategoryService } from 'src/app/sales/services/category.service';
import { ProductService } from 'src/app/sales/services/product.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {
 


  private productService = inject(ProductService);

  private categoryService = inject(CategoryService);

  private fb = inject(FormBuilder);

  public categories: CategoryDto[] = [];

  public activateRoute = inject(ActivatedRoute);

  public myFormProduct: FormGroup = this.fb.group({
    id: 0,
    name: ['', []],
    description: ['', []],
    active: [false, []],
    price: [0, []],
    category: [''],
  });



  ngOnInit(): void {
      this.activateRoute.params.subscribe((params) => {
        console.log(params['pId']);
      })
  }

}
