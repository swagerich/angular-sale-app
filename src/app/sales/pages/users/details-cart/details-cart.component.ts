import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CartService } from 'src/app/sales/services/cart.service';
import {
  from,
  map,
  mergeMap,
  of,
  Subscription,
  switchMap,
} from 'rxjs';
import { CartItemDto } from 'src/app/sales/interfaces/cartDto-interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/sales/services/auth.service';
import { ValidatorService } from 'src/app/utils/service/validator.service';
import { ProductService } from 'src/app/sales/services/product.service';

@Component({
  selector: 'app-details-cart',
  templateUrl: './details-cart.component.html',
  styleUrls: ['./details-cart.component.css'],
})
export class DetailsCartComponent implements OnInit, OnDestroy {
  private cartService = inject(CartService);

  private productService = inject(ProductService);

  private authService = inject(AuthService);

  private validatorService = inject(ValidatorService);

  public subscription$ = new Subscription();

  public displayedColumns: string[] = ['item', 'cost', 'quantity', 'actions'];

  public transactions: CartItemDto[] = [];

  public valorTotal: number = 0;

  public userId: number = 0;

  public existsImage: boolean = false;

  private fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    inputValue: [1, [Validators.min(1)]],
  });

  ngOnInit(): void {
    this.userId = this.authService.getUser().userId;
    this.loadCartByUserId(this.userId);
  }

  loadCartByUserId(userId: number): void {
    this.subscription$ = this.cartService
      .fetchCartByUserId(userId)
      .pipe(
        switchMap((cart) => {
          this.transactions = cart.cartItem;
          this.valorTotal = cart.totalCosto;
          return from(cart.cartItem).pipe(
            mergeMap((cartItem) => {
              if (!cartItem.product.namePhoto && !cartItem.product.filePath) {
                return of(null);
              }
              return this.productService
                .fetchPhotoById(cartItem.product.id, cartItem.product.namePhoto)
                .pipe(
                  map((photo) => {
                    const blob = new Blob([photo], {
                      type: 'image/jpeg' || 'image/png',
                    });
                    cartItem.product.productImagen = URL.createObjectURL(blob);
                  })
                );
            })
          );
        })
      )
      .subscribe({
        next: (valor) => {
          //lo comento porque por ahora utilizare el input en el  html
          // valor.cartItem.forEach(cart => {
          //   const controlQuantity = 'inputValue_' + cart.id;
          //   this.myForm.addControl(controlQuantity, new FormControl(cart.quantity));
          // });
        },
      });
  }

  // lo comento porque por ahora utilizare el input en el  html
  // updateQuantity(cartId: number, quantity: number) {
  //   this.cartService.updateProductQuantity(cartId, quantity).subscribe({
  //     next: () => {},
  //   });
  // }

  deleteProductToCart(cartId: number, productId: number) {
    this.cartService.removeProductFromCart(cartId, productId).subscribe({
      next: () => {
        this.loadCartByUserId(this.userId);
        this.validatorService.validateSnackBar(
          'Producto eliminado del carrito'
        );
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
