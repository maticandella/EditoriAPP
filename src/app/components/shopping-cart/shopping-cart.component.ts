import { Component, inject, Input } from '@angular/core';
import { ShoppingCart } from '../../interfaces/shoppingCart/ShoppingCart';
import { CommonModule } from '@angular/common';
import { ShoppingCartService } from '../../services/shoppingCart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent {
  @Input() cart: ShoppingCart | null = null;

  shoppingCartService = inject(ShoppingCartService);

  removeFromCart(bookId: number) {
    this.shoppingCartService.removeFromCart(bookId);
  }
}
