import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CartService } from 'src/app/sales/services/cart.service';
import { delay, Subscription } from 'rxjs';
import { CartItemDto } from 'src/app/sales/interfaces/cartDto-interface';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-details-cart',
  templateUrl: './details-cart.component.html',
  styleUrls: ['./details-cart.component.css'],
})
export class DetailsCartComponent implements OnInit,OnDestroy {
 
  private cartService = inject(CartService);

  public subscription$ = new Subscription();

  public displayedColumns: string[] = ['item', 'cost', 'quantity', 'actions'];

  public transactions: CartItemDto[] = [];

  public valorTotal: number = 0;

  private fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    inputValue: [1, [Validators.min(1)]],
  });

  ngOnInit(): void {
    this.loadCartByUserId(1);
  }

  loadCartByUserId(userId: number): void {
   this.subscription$ = this.cartService
      .fetchCartByUserId(userId)
      .pipe(delay(1000))
      .subscribe({
        next: (valor) => {
          this.transactions = valor.cartItem;
          this.valorTotal = valor.totalCosto;

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
        this.loadCartByUserId(1);
      },
    });
  }

  ngOnDestroy(): void {
    if(this.subscription$){
      this.subscription$.unsubscribe();
    }
  }
}
