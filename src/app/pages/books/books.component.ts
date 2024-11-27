import { Component, inject, OnInit } from '@angular/core';
import { Book } from '../../interfaces/Book';
import { BookService } from '../../services/books.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PaginationComponent } from './../../components/pagination/pagination.component';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, HttpClientModule, PaginationComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  totalPages: number = 1;
  totalAuthors: number = 0;
  currentPage: number = 1;

  private bookService = inject(BookService);
  private router = inject(Router);

  ngOnInit(): void {
    this.getBooksPaginated(this.currentPage, 10);
  }

  getBooksPaginated(page: number, limit: number) {
    this.bookService.getAll(page, limit).subscribe(response => {
      this.books = response.data.items;
      this.totalPages = response.data.totalPages;
      this.totalAuthors = response.data.totalItems;
      this.currentPage = page;
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getBooksPaginated(this.currentPage, 10);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getBooksPaginated(this.currentPage, 10);
    }
  }
}
