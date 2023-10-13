import { Component, Input, OnInit } from '@angular/core';
import { ProductDto } from '../../interfaces/productDto-interface';

@Component({
  selector: 'app-component-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input()
  public product! : ProductDto;
  
  ngOnInit(): void {
    if (!this.product) throw new Error('product is indefinide!');
  }
}
