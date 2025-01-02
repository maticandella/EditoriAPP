import { Author } from './../../../../interfaces/Author';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule  } from '@angular/router';
import { AuthorService } from '../../../../services/authors.service';
import { ModalDeleteComponent } from "../../../modals/modal-delete/modal-delete.component";
import { ModalViewBooksComponent } from "../../../modals/modal-view-books/modal-view-books.component";
import { BookService } from '../../../../services/books.service';
import { Book } from '../../../../interfaces/Book';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-authors-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ModalDeleteComponent, RouterModule, ModalViewBooksComponent],
  templateUrl: './authors-list.component.html'
})
export class AuthorsListComponent implements OnInit {
  authors: Author[] = [];
  books: Book[] = [];
  paginatedAuthors: Author[] = [];
  totalPages: number = 1; 
  totalAuthors: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  name: string = '';
  selectedLetter: string = '';

  //#region Params Modal Delete
  isModalOpen = false;
  showDeleteButton = true;
  isOperationSuccessful = false;
  authorName: string = '';
  authorId: number = 0;
  message: string = '';
  //#endregion

  //#region Params Modal View Books
  isModalViewBooksOpen = false;
  //#endregion

  private authorService = inject(AuthorService);
  // private bookService = inject(BookService);
  private router = inject(Router);

  ngOnInit(): void {
    this.getAuthorsPaginated(this.currentPage, this.itemsPerPage);
  }

  getAuthorsPaginated(page: number, limit: number): void {
    this.authorService.getAll(page, limit).subscribe(response => {
      this.authors = response.data.items;
      this.totalPages = response.data.totalPages;
      this.totalAuthors = response.data.totalItems;
      this.currentPage = page;
      this.updatePaginatedAuthors();
    });
  }

  // getBooksByAuthorId(currentId: number): Promise<Book[]> {
  //   return this.bookService.getByAuthorId(currentId).pipe(
  //     map(response => response?.data?.books ?? []),
  //     catchError(e => { return of([]); })
  //   ).toPromise() as Promise<Book[]>;
  // }

  search(page: number, limit: number, name: string, letter: string = ''): void {
    this.authorService.search(page, limit, name, letter).subscribe(response => {
      this.authors = response.data.items;
      this.totalPages = response.data.totalPages;
      this.totalAuthors = response.data.totalItems;
      this.currentPage = page;
      this.selectedLetter = letter;
      this.updatePaginatedAuthors();
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.getAuthorsPaginated(page, this.itemsPerPage);
  }

  updatePaginatedAuthors(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAuthors = this.authors.slice(startIndex, endIndex);
  }

  onSearch(): void {
    this.search(this.currentPage, this.itemsPerPage, this.name, this.selectedLetter);
  }

  clearFilters(): void {
    this.name = '';
    this.selectedLetter = '';
    this.getAuthorsPaginated(1, this.itemsPerPage);
  }

  //#region Manejo del modal de Delete
  openModalDeleteWithParameters(currentId: number, authorFullName: string) {
    this.authorId = currentId;
    this.authorName = authorFullName; 
    this.message = `¿Está seguro de eliminar a ${authorFullName}?`;
    this.isModalOpen = true;
    this.showDeleteButton = true;
    this.isOperationSuccessful = false;
  }

  handleConfirm() {
    if (this.authorId > 0) {
      var defaultErrorMessage = 'Error al eliminar el autor.';

      this.authorService.delete(this.authorId)
      .subscribe(
        (response) => {
          if(response.status === 204) {
            this.message = `La operación se realizó con éxito`;
            this.getAuthorsPaginated(this.currentPage, this.itemsPerPage);
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

  //#region Manejo del Modal View Books
  // async openModalViewBooks(currentId: number) {
  //   try {
  //     this.books = await this.getBooksByAuthorId(currentId);
  //     this.isModalViewBooksOpen = true;
  //     console.log("librossss", this.books)
  //   } catch (error) {
  //     console.error("Error al cargar los libros del autor:", error);
  //   }
  // }
  //#endregion
}
