import { Component, inject, OnInit } from '@angular/core';
import { CartService } from 'src/app/sales/services/cart.service';
import { delay } from 'rxjs';
import { CartItemDto } from 'src/app/sales/interfaces/cartDto-interface';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-details-cart',
  templateUrl: './details-cart.component.html',
  styleUrls: ['./details-cart.component.css'],
})
export class DetailsCartComponent implements OnInit {
  private cartService = inject(CartService);

  displayedColumns: string[] = ['item', 'cost', 'quantity', 'actions'];

  transactions: CartItemDto[] = [];

  valorTotal: number = 0;

  private fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    inputValue: [1, [Validators.min(1)]],
  });

  ngOnInit(): void {
    this.loadCartByUserId(1);
  }

  loadCartByUserId(userId: number): void {
    this.cartService
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
}
