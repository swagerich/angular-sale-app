import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CartService } from 'src/app/sales/services/cart.service';
import { CartItemDto } from '../../../interfaces/cartDto-interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-order-detail',
  templateUrl: './add-order-detail.component.html',
  styleUrls: ['./add-order-detail.component.css']
})
export class AddOrderDetailComponent implements OnInit,OnDestroy {
  
 
  private cartService = inject(CartService);

  private fb = inject(FormBuilder);

  public cartsItems : CartItemDto [] = [];

  public totalCosto : number = 0;

  public subscription$ = new Subscription();

  public myFormDetails : FormGroup = this.fb.group({
    fullName:[''],
    fullAddress:[''],
    contactNumber:[''],
    alternativeContactNumber: [''],
    city:[''],
    postal:[''],
    products:[{
      productId:1,
      userId:1
    }]
  });


  ngOnInit(): void {
    this.loadCartByUserId(1);
  
  }


  saveOrder() : void {

  }


  loadCartByUserId(userId: number): void {
   this.subscription$ = this.cartService.fetchCartByUserId(userId).subscribe({
      next:(cart) =>{
        this.cartsItems = cart.cartItem
        this.totalCosto = cart.totalCosto;
      }
    })
    
  }
  ngOnDestroy(): void {
    if(this.subscription$){
      this.subscription$.unsubscribe();
    }
  }
}
