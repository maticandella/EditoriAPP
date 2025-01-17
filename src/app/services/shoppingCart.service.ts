import { Injectable } from "@angular/core";
import { ShoppingCart } from '../interfaces/shoppingCart/ShoppingCart';
import { Book } from "../interfaces/Book";

@Injectable({
    providedIn: 'root'
  })
  
export class ShoppingCartService {
    getCart(): ShoppingCart {
        const cart = localStorage.getItem('shoppingCart');   
        return cart ? JSON.parse(cart) : { items: [], totalPrice: 0 };
    }

    saveCart(cart: ShoppingCart): void {
        localStorage.setItem("shoppingCart", JSON.stringify(cart));
    }

    addToCart(book: Book, quantity: number): void {
        const cart = this.getCart();
        const existingItem = cart.items.find(item => item.book.id === book.id);

        if (existingItem) {
            existingItem.quantity+= quantity;
            existingItem.totalItemPrice = existingItem.quantity * book.price;
        }
        else {
            cart.items.push({
                book,
                quantity,
                totalItemPrice: book.price * quantity,
            });
        }

        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.totalItemPrice, 0);
        this.saveCart(cart);
    }
}