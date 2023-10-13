import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs';
import { ProductService } from 'src/app/sales/services/product.service';
import { ProductDto } from '../../../interfaces/productDto-interface';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'src/app/sales/services/cart.service';

@Component({
  selector: 'app-details-product',
  templateUrl: './details-product.component.html',
  styleUrls: ['./details-product.component.css'],
})
export class DetailsProductComponent implements OnInit {

  private productService = inject(ProductService);

  private activateRoute = inject(ActivatedRoute);

  private cartService = inject(CartService);

  private fb = inject(FormBuilder);

  public myForm:FormGroup = this.fb.group({
    inputValue:[1,[Validators.min(1)]]
  })

  public product!: ProductDto;


  public defect =5;
  ngOnInit(): void {
    this.getProductById(); 
  }

  getProductById(): void {
    this.activateRoute.params
      .pipe(
        switchMap((param: Params) =>
          this.productService.fetchProductById(param['pId'])
        )
      )
      .subscribe({
        next: (valor) => {
            this.product = valor;
        },
        error: (e:HttpErrorResponse) => {
            // MANJEAR EL ERROR  DEL SERVIDOR
        },
      });
  }

  
  showValue(productId:number,userId:number){
   let valor = this.myForm.get('inputValue')?.value;
    if(valor){
      this.cartService.addProductToCart(productId,userId,valor).subscribe(data =>{
        console.log(data)
      });
    }
  }


}
