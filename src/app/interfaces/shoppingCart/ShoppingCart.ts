import { CartItem } from "./CartItem";

// Interface principal del carrito de compras
export interface ShoppingCart {
    items: CartItem[];
    totalPrice: number;
}