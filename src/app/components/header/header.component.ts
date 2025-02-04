import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../services/shoppingCart.service';
import { ShoppingCartComponent } from "../shopping-cart/shopping-cart.component";
import { ShoppingCart } from '../../interfaces/shoppingCart/ShoppingCart';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ShoppingCartComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  dropDownOpen = false;
  navLinks = [
    { href: 'authors', text: 'Autores' },
    { href: 'books', text: 'Libros' },
    { href: 'about', text: 'Sobre Nosotros' }
  ];
  quantityInCart = 0;
  cart: ShoppingCart | null = null;

  constructor (private shoppingCartService: ShoppingCartService) {}

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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleDropDown() {
    this.dropDownOpen = !this.dropDownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;

    // Verifica si el clic ocurrió fuera del dropdown
    if (!targetElement.closest('.dropdown') && !targetElement.closest('.feather-shopping-cart')) {
      this.dropDownOpen = false;
    }
  }
}
