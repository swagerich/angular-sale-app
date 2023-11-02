import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  switchMap,
  Subscription,
  map,
  catchError,
  EMPTY,
  of,
} from 'rxjs';
import { ProductService } from 'src/app/sales/services/product.service';
import { ProductDto } from '../../../interfaces/productDto-interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'src/app/sales/services/cart.service';
import { ValidatorService } from 'src/app/utils/service/validator.service';
import { AuthService } from 'src/app/sales/services/auth.service';

@Component({
  selector: 'app-details-product',
  templateUrl: './details-product.component.html',
  styleUrls: ['./details-product.component.css'],
})
export class DetailsProductComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);

  private activateRoute = inject(ActivatedRoute);

  private validatorService = inject(ValidatorService);

  private authService = inject(AuthService);

  public subscription$ = new Subscription();

  private cartService = inject(CartService);

  private fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    inputValue: [1, [Validators.min(1)]],
  });

  public product!: ProductDto;

  public userId: number = 0;

  ngOnInit(): void {
    this.userId = this.authService.getUser().userId;
    this.getProductById();
  }

  getProductById(): void {
   this.subscription$ = this.activateRoute.params
      .pipe(
        switchMap((param: Params) =>
          this.productService.fetchProductById(param['pId'])
        ),
        switchMap((p: ProductDto) => {
          this.product = p;
          if (!p.namePhoto && !p.filePath) {
            return of(null);
          }
          return this.productService.fetchPhotoById(p.id!, p.namePhoto).pipe(
            map((response: ArrayBuffer) => {
              const blob = new Blob([response], {
                type: 'image/jpeg' || 'image/png',
              });
              p.productImagen = URL.createObjectURL(blob);
              return p;
            })
          );
        }),
        catchError((error) => {
          this.validatorService.showSnackBarForError(error);
          return EMPTY;
        })
      )
      .subscribe({
        next: () => {}
      });
  }

  addCart(productId: number) {
    let valor = this.myForm.get('inputValue')?.value;
    if (valor > 0 && valor === Math.floor(valor)) {
      this.cartService
        .addProductToCart(productId, this.userId, valor)
        .subscribe(() => {
          this.validatorService.validateSnackBar(
            'Producto agregado al carrito'
          );
        });
    } else {
      this.validatorService.validateSnackBar(
        'Debe ingresar un valor entero o valor mayor a 0'
      );
      this.myForm.get('inputValue')?.setValue(1);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
