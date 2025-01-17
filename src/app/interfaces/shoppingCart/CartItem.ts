import { Book } from "../Book";

// Interface para cada item del carrito
export interface CartItem {
    book: Book; 
    quantity: number;
    totalItemPrice: number; // total para este item (book.price * quantity)
}
