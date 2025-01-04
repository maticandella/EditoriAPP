import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Book } from '../../../../interfaces/Book';
import { BookService } from '../../../../services/books.service';
import { ModalDeleteComponent } from "../../../modals/modal-delete/modal-delete.component";

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [CommonModule, ModalDeleteComponent],
  templateUrl: './books-list.component.html'
})
export class BooksListComponent implements OnInit {
  books: Book[] = [];
  paginatedBooks: Book[] = [];
  totalPages: number = 1; 
  totalBooks: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  headers: string[] = [ 'Título', 'Autor', 'ISBN', 'Precio', 'Agregado el' ];

  private bookService = inject(BookService);

  ngOnInit(): void {
    this.getBooksPaginated(this.currentPage, this.itemsPerPage);
  }

  getBooksPaginated(page: number, limit: number): void {
    this.bookService.getAll(page, limit).subscribe(response => {
      this.books = response.data.items;
      this.totalPages = response.data.totalPages;
      this.totalBooks = response.data.totalItems;
      this.currentPage = page;
      this.updatePaginatedBooks();
    });
  }

  updatePaginatedBooks(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBooks = this.books.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.getBooksPaginated(page, this.itemsPerPage);
  }
}
