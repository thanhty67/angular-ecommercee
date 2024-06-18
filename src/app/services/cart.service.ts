import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItiems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuanity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {
    //check if we alreadfy have the item in ourt cart
    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;


    if (this.cartItiems.length > 0) {
      //find the item in the cart based on item id
      
      existingCartItem = this.cartItiems.find(tempCartItem => tempCartItem.id === theCartItem.id);
      
      //check if we found it
      alreadyExistInCart = (existingCartItem != undefined);
    }
    if (alreadyExistInCart) {
      existingCartItem!.quantity++;
    } else {
      this.cartItiems.push(theCartItem);
    }

    //compute cart total price and quanity
    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuanityValue: number = 0;

    for (let currentCartItem of this.cartItiems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuanityValue += currentCartItem.quantity;

      //publish the new values .. all subcribers will recive the new data
      this.totalPrice.next(totalPriceValue);
      this.totalQuanity.next(totalQuanityValue);
    }
    console.log('Content of cart')
    for (let tempCartItem of this.cartItiems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quanity: ${tempCartItem.quantity}, subTotalPrice: ${subTotalPrice.toFixed(2)}`)

    }
  }
}
