import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ShoppingCart } from '../../../interfaces/shoppingCart/ShoppingCart';
import { ShoppingCartService } from '../../../services/shoppingCart.service';
import { Book } from '../../../interfaces/Book';

@Component({
  selector: 'app-cart-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent implements OnInit {
  quantityInCart = 0;
  cart: ShoppingCart | null = null;
  showWarning: boolean = false;

  shoppingCartService = inject(ShoppingCartService);
  totalQuantity$ = this.shoppingCartService.totalQuantity$;

  ngOnInit(): void {
    // Me suscribo al totalQuantity$ para obtener actualizaciones en tiempo real
    this.shoppingCartService.totalQuantity$.subscribe(quantity => {
      this.quantityInCart = quantity;
    });

    // Me suscribo al carrito para tener sus actualizaciones
    this.shoppingCartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  addToShoppingCart(book: Book) {
    this.shoppingCartService.addToCart(book, 1);
  }

  removeOneFromCart(book: Book) {
    this.shoppingCartService.removeOneFromCart(book);
  }

  removeFromCart(bookId: number) {
    this.shoppingCartService.removeFromCart(bookId);
  }

  showWarningInPurchase() {
    this.showWarning = true;
  }
}
