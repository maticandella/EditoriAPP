import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBooksComponent } from "../../../form/form-books/form-books.component";
import { BookService } from '../../../../services/books.service';
import { ModalComponent } from "../../../modals/modal-add/modal-add.component";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { AuthorService } from '../../../../services/authors.service';
import { Author } from '../../../../interfaces/Author';

@Component({
  selector: 'app-books-add',
  standalone: true,
  imports: [CommonModule, FormBooksComponent, ModalComponent],
  templateUrl: './books-add.component.html'
})
export class BooksAddComponent implements OnInit, AfterViewInit {
  newBookId = 0;
  authorId = 0;
  author: Author | null = null;
  isModalOpen = false;
  @ViewChild(FormBooksComponent) formBooksComponent!: FormBooksComponent;
  
  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}
  
  private authorService = inject(AuthorService);
  private bookService = inject(BookService);
  private router = inject(Router)

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['authorId']) {
        this.authorId = +params['authorId'];
        this.getAuthorById(this.authorId);
      }
    });
  }
  
  /*
  * Espera a que se cargue el ViewChild para actualizar el formulario
  ? Esto lo hago para volver a cargar un libro para el mismo autor si es que navegaste desde admin/authors
  */
  ngAfterViewInit(): void {
    if (this.authorId > 0) {
      this.formBooksComponent.form.patchValue({
        authorId: this.authorId,
      });

      // Forzar la detección de cambios
      this.cdr.detectChanges();
    }
  }

  /* 
  * Obtener autor en caso de ser enviado su id por url
  */
  getAuthorById(id: number) {
    this.authorService.getById(id).subscribe(response => {
      this.author = response.data.author;
    });
  }
  
  /** 
  * * Crear libro
  * ? En este metodo creo al libro, en base a los valores del form, y luego se maneja la respuesta o el error, yendo al handle correspondiente
  */
  create(formValue: { title: string, authorId: number, genreId: number, editionId: number, isbn: string, pagesNumber: number, year: number, review: string, price: number }): void {
    const { title, authorId, genreId, editionId, isbn, pagesNumber, year, review, price } = formValue;
    const currentAuthorId = (this.authorId > 0) ? this.authorId : authorId;

    console.log("authorId:", currentAuthorId)
    console.log("authorName:", this.author?.name)

    this.bookService.create(title.trim(), currentAuthorId, genreId, editionId, this.formBooksComponent.photoName || '', isbn.trim(), pagesNumber, year, review.trim(), price)
      .subscribe({
          next: (response) => this.handleCreateSuccess(response),
          error: (error) => this.handleCreateError(error)
        });
  }

  private handleCreateSuccess(response: HttpResponse<{ data: { id: number } }>): void {
      if(response.status === 201) {
        this.newBookId = response.body?.data?.id || 0;
        this.openModal();
      }
    }

    /**
   * * Handle de errores
   * ? En este handle se contemplan los errores que puedan venir por validaciones del API
   * @param error 
   */
  private handleCreateError(error: any): void {
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
    this.formBooksComponent.form.reset();
    this.formBooksComponent.photoName = '';
    if (this.authorId > 0) {
      this.formBooksComponent.form.patchValue({
        authorName: this.author?.name + ' ' + this.author?.lastName || '',
      });
    }
    this.router.navigate(['admin/books/add'], {
      queryParams: { authorId: this.authorId > 0 ? this.authorId : null },
    });
  }

  handleCancel() {
    this.isModalOpen = false;
    if (this.authorId > 0) {
      this.router.navigate(['admin/authors']);
    }
    else {
      this.router.navigate(['admin/books']);
    }
  }
  //#endregion
}
