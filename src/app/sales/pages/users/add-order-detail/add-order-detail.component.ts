import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'src/app/sales/services/cart.service';
import { CartItemDto } from '../../../interfaces/cartDto-interface';
import { Subscription, from, map, mergeMap, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/sales/services/auth.service';
import { ProductService } from 'src/app/sales/services/product.service';
import { OrderDetailDto } from 'src/app/sales/interfaces/orderDetailDto-interface';
import { ValidatorService } from 'src/app/utils/service/validator.service';
import { OrderDetailService } from 'src/app/sales/services/order-detail.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-order-detail',
  templateUrl: './add-order-detail.component.html',
  styleUrls: ['./add-order-detail.component.css'],
})
export class AddOrderDetailComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);

  private cartService = inject(CartService);

  private productService = inject(ProductService);

  private orderDetailService = inject(OrderDetailService);

  private validatorService = inject(ValidatorService);

  private router = inject(Router);

  private fb = inject(FormBuilder);

  public cartsItems: CartItemDto[] = [];

  public totalCosto: number = 0;

  private userId: number = 0;

  private selectedProductIds: number[] = [];

  public subscription$ = new Subscription();

  public myFormDetails: FormGroup = this.fb.group({
    fullName: ['', [Validators.required]],
    fullAddress: ['', [Validators.required]],
    contactNumber: ['', [Validators.required]],
    alternativeContactNumber: ['', [Validators.required]],
    city: ['', [Validators.required]],
    postal: ['', [Validators.required]],
    products: this.fb.array([
      this.fb.group({
        productId: [''],
        userId: [''],
      }),
    ]),
  });

  ngOnInit(): void {
    this.userId = this.authService.getUser().userId;
    this.loadCartByUserId();
  }

  get currentOrderDetail(): OrderDetailDto {
    return this.myFormDetails.value as OrderDetailDto;
  }

  saveOrder(): void {
    const productsToAdd = this.selectedProductIds.map((productId) => {
      return {
        productId,
        userId: this.userId,
      };
    });
    this.myFormDetails.get('products')?.value.splice(0);
    this.myFormDetails.get('products')?.value.push(...productsToAdd);

    Swal.fire('Success', 'Order saved successfully', 'success').then((s) => {
      if (s.isConfirmed) {
        this.subscription$ = this.orderDetailService
          .saveOrderDetail(this.currentOrderDetail)
          .subscribe({
            next: () => {
              // FALTA IMPLEMENTAR EL PROCESO DE PAGO
              this.cartService.clearCart(this.userId).subscribe();
              this.router.navigate(['/user/order-details']);
            },
            error: (e: HttpErrorResponse) => {
              this.validatorService.showSnackBarForError(e);
            },
          });
      }
    });

  }

  loadCartByUserId(): void {
    this.subscription$ = this.cartService
      .fetchCartByUserId(this.userId)
      .pipe(
        switchMap((cart) => {
          this.cartsItems = cart.cartItem;
          this.totalCosto = cart.totalCosto;
          return from(cart.cartItem).pipe(
            mergeMap((cartItem) => {
              this.selectedProductIds.push(cartItem.product.id);
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
        next: () => {},
      });
  }

  validateOnField(field: string): boolean | null {
    return this.validatorService.isValidField(this.myFormDetails, field);
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
