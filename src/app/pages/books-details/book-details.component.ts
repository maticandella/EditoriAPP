import { Component, inject, OnInit } from '@angular/core';
import { Book } from '../../interfaces/Book';
import { BookService } from '../../services/books.service';
import { ActivatedRoute } from '@angular/router';
import { Response } from '../../interfaces/response/Response';
import { BookResponse } from '../../interfaces/response/BookResponse';
import { ShoppingCartService } from '../../services/shoppingCart.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-books-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-details.component.html'
})
export class BookDetailsComponent implements OnInit {
  book: Book = {} as Book;
  showToast: boolean = false;
  toastMessage: string = '';
  private toastQueue: string[] = [];
  private toastTimeout: any;

  private activatedRoute = inject(ActivatedRoute);
  private bookService = inject(BookService);
  private shoppingCartService = inject(ShoppingCartService)

  ngOnInit(): void {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getBookById(id);
  }

  getBookById(id: number): void {
    if (id) {
      this.bookService.getById(id).subscribe(
        (response: Response<BookResponse>) => {
          this.book = response.data.book;
        }
      );
    }
  }

  addToShoppingCart(book: Book) {
    this.shoppingCartService.addToCart(book, 1);
    this.showToastMessage(`${book.title} fue añadido al carrito de compras.`);
  }

  showToastMessage(message: string) {
    if (this.showToast) {
      this.toastQueue.push(message); //Cola de mensajes, para que no se pisen uno con otro
    } else {
      this.toastMessage = message;
      this.showToast = true;
  
      this.toastTimeout = setTimeout(() => {
        this.showToast = false;
  
        if (this.toastQueue.length > 0) {
          const nextMessage = this.toastQueue.shift();
          this.showToastMessage(nextMessage!);
        }
      }, 3000);
    }
  }
}
