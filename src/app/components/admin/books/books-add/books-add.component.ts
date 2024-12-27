import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBooksComponent } from "../../../form/form-books/form-books.component";
import { BookService } from '../../../../services/books.service';
import { ModalComponent } from "../../../modals/modal-add/modal-add.component";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-books-add',
  standalone: true,
  imports: [FormBooksComponent, ModalComponent],
  templateUrl: './books-add.component.html'
})
export class BooksAddComponent implements OnInit {
  newBookId = 0;
  authorId: string | null = null;
  isModalOpen = false;
  @ViewChild(FormBooksComponent) formBooksComponent!: FormBooksComponent;
  
  constructor(private route: ActivatedRoute) {}
  
  private bookService = inject(BookService);
  private router = inject(Router)

  ngOnInit(): void {
    // Capturar el query param `authorId`
    this.route.queryParamMap.subscribe(params => {
      this.authorId = params.get('authorId'); // Puede ser `null` si no se pasa
    });
  }
  
  /** 
  * * Crear libro
  * ? En este metodo creo al libro, en base a los valores del form, y luego se maneja la respuesta o el error, yendo al handle correspondiente
  */
  create(formValue: { title: string, authorId: number, genreId: number, editionId: number, isbn: string, pagesNumber: number, year: number, review: string, price: number }): void {
    const { title, authorId, genreId, editionId, isbn, pagesNumber, year, review, price } = formValue;
    this.bookService.create(title, authorId, genreId, editionId, this.formBooksComponent.photoName || '', isbn, pagesNumber, year, review, price)
      .subscribe({
          next: (response) => this.handleCreateSuccess(response),
          //error: (error) => this.handleCreateError(error)
        });
  }

  private handleCreateSuccess(response: HttpResponse<{ data: { id: number } }>): void {
      if(response.status === 201) {
        this.newBookId = response.body?.data?.id || 0;
        this.openModal();
      }
    }

  //#region Manejo del modal
  openModal() {
    this.isModalOpen = true;
  }

  handleConfirm() {
    this.isModalOpen = false;
    //this.router.navigate(['admin/authors/add']);
    this.formBooksComponent.form.reset();
  }

  handleCancel() {
    this.isModalOpen = false;
    //this.router.navigate(['admin/authors']);
  }
  //#endregion
}
