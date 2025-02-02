import { Injectable } from "@angular/core";
import { ShoppingCart } from '../interfaces/shoppingCart/ShoppingCart';
import { Book } from "../interfaces/Book";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  
export class ShoppingCartService {
    private cartSubject = new BehaviorSubject<ShoppingCart>(this.getCart());
    cart$ = this.cartSubject.asObservable();

    private totalQuantity = new BehaviorSubject<number>(0);
    totalQuantity$ = this.totalQuantity.asObservable();

    constructor() {
        this.updateTotalQuantity();
    }
    
    getCart(): ShoppingCart {
        const cart = localStorage.getItem('shoppingCart');   
        return cart ? JSON.parse(cart) : { items: [], totalPrice: 0 };
    }

    saveCart(cart: ShoppingCart): void {
        localStorage.setItem("shoppingCart", JSON.stringify(cart));
        this.cartSubject.next(cart);
        this.updateTotalQuantity();
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

    removeOneFromCart(book: Book): void {
        const cart = this.getCart();
        const existingItemIndex = cart.items.findIndex(item => item.book.id === book.id);

        if (existingItemIndex !== -1) {
            const existingItem = cart.items[existingItemIndex];

            if (existingItem.quantity > 1) {
                existingItem.quantity-= 1;
                existingItem.totalItemPrice = existingItem.quantity * book.price;
            }
        }
        else {
            // Si la cantidad es 1, elimino el item del carrito
            cart.items.splice(existingItemIndex, 1);
        }

        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.totalItemPrice, 0);
        this.saveCart(cart);
    }

    removeFromCart(bookId: number): void {
        const cart = this.getCart();
        cart.items = cart.items.filter(item => item.book.id !== bookId);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.totalItemPrice, 0);
        this.saveCart(cart);
    }

    clearCart(): void {
        localStorage.removeItem("shoppingCart");
        this.totalQuantity.next(0);
    }

    private updateTotalQuantity(): void {
        const cart = this.getCart();
        const total = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        this.totalQuantity.next(total); // Acá emito el nuevo valor al BehaviorSubject
    }
}