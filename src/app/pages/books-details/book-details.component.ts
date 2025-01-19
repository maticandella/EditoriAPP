import { Component, inject, OnInit } from '@angular/core';
import { Book } from '../../interfaces/Book';
import { BookService } from '../../services/books.service';
import { ActivatedRoute } from '@angular/router';
import { Response } from '../../interfaces/response/Response';
import { BookResponse } from '../../interfaces/response/BookResponse';

@Component({
  selector: 'app-books-details',
  standalone: true,
  imports: [],
  templateUrl: './book-details.component.html'
})
export class BookDetailsComponent implements OnInit {
  book: Book = {} as Book;

  private bookService = inject(BookService);
  private activatedRoute = inject(ActivatedRoute);

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
}
