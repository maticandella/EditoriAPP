import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../../../modals/modal-add/modal-add.component';
import { FormBooksComponent } from '../../../form/form-books/form-books.component';
import { Book } from '../../../../interfaces/Book';
import { BookService } from '../../../../services/books.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-books-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, FormBooksComponent],
  templateUrl: './books-edit.component.html'
})
export class BooksEditComponent {
  isModalOpen = false;
  book: Book | null = null;
  @ViewChild(FormBooksComponent) formBooksComponent!: FormBooksComponent;

  private bookService = inject(BookService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getBookById(id);
  }

  /* 
  * Obtener libro que se va a modificar
  */
  getBookById(id: number) {
    this.bookService.getById(id).subscribe(response => {
      this.book = response.data.book;
    });
  }

  /** 
  * * Modificar libro
  * ? En este metodo se modifica al libro, en base a los valores del form, y luego se maneja la respuesta o el error, yendo al handle correspondiente
  */
  update(formValue: { title: string, authorId: number, genreId: number, editionId: number, isbn: string, pagesNumber: number, year: number, review: string, price: number }): void {
    const { title, authorId, genreId, editionId, isbn, pagesNumber, year, review, price } = formValue;
    this.bookService.update(this.book?.id ?? 0, title, authorId, genreId, editionId, this.formBooksComponent.photoName || '', isbn, pagesNumber, year, review, price)
      .subscribe({
          next: (response) => this.openModal(),
          error: (error) => this.handleError(error)
        });
  }

  /**
     * * Handle de errores
     * ? En este handle se contemplan los errores que puedan venir por validaciones del API
     * @param error 
     */
  private handleError(error: any): void {
    this.formBooksComponent.generalErrors = [];
    if (error.status === 400 && error.error?.errors) {
      const errorMessages = error.error.errors;

      errorMessages.forEach((message: string) => {
        this.formBooksComponent.generalErrors.push(message);
      });
    } else {
      this.formBooksComponent.generalErrors.push("Ocurrió un error inesperado. Inténtalo de nuevo más tarde.");
    }
  }

  //#region Manejo del modal
  openModal() {
    this.isModalOpen = true;
  }
  
  handleConfirm() {
    this.isModalOpen = false;
    this.router.navigate(['/admin/books/edit', this.book?.id ?? 0]);
  }
  
  handleCancel() {
    this.isModalOpen = false;
    this.router.navigate(['admin/books']);
  }
  //#endregion
}
