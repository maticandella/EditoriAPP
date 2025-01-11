import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Book } from '../../../../interfaces/Book';
import { BookService } from '../../../../services/books.service';
import { ModalDeleteComponent } from "../../../modals/modal-delete/modal-delete.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalDeleteComponent],
  templateUrl: './books-list.component.html'
})
export class BooksListComponent implements OnInit {
  books: Book[] = [];
  paginatedBooks: Book[] = [];
  totalPages: number = 1; 
  totalBooks: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  title: string = '';

  //#region Params Modal Delete
  isModalOpen = false;
  showDeleteButton = true;
  isOperationSuccessful = false;
  // title: string = '';
  bookId: number = 0;
  message: string = '';
  //#endregion

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

  search(page: number, limit: number, title: string): void {
    this.bookService.search(page, limit, title).subscribe(response => {
      this.books = response.data.items;
      this.totalPages = response.data.totalPages;
      this.totalBooks = response.data.totalItems;
      this.currentPage = page;
      this.updatePaginatedBooks();
    });
  }

  //#region Manejo del modal de Delete
  openModalDeleteWithParameters(currentId: number, title: string) {
    this.bookId = currentId;
    this.title = title; 
    this.message = `¿Está seguro de eliminar el libro "${title}"?`;
    this.isModalOpen = true;
    this.showDeleteButton = true;
    this.isOperationSuccessful = false;
  }

  handleConfirm() {
    if (this.bookId > 0) {
      var defaultErrorMessage = 'Error al eliminar el libro.';

      this.bookService.delete(this.bookId)
      .subscribe(
        (response) => {
          if(response.status === 204) {
            this.message = `La operación se realizó con éxito`;
            this.getBooksPaginated(this.currentPage, this.itemsPerPage);
            this.showDeleteButton = false;
            this.isOperationSuccessful = true;
          } else {
            if (response.body && response.body.errors && response.body.errors.length > 0) {
              this.message = response.body.errors.join(', ') || defaultErrorMessage;
            } else {
              this.message = defaultErrorMessage;
            }
          }
        },
        (error) => {
          if (error.error && error.error.errors && error.error.errors.length > 0) {
            this.message = error.error.errors.join(', ') || defaultErrorMessage;
          } else {
            this.message = defaultErrorMessage;
          }
        }
      );
    }
  }

  handleCancel() {
    this.isModalOpen = false;
  }
  //#endregion
}
