import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from "../../../modals/modal-add/modal-add.component";
import { FormAuthorsComponent } from "../../../form/form-authors/form-authors.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthorService } from '../../../../services/authors.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Author } from '../../../../interfaces/Author';

@Component({
  selector: 'app-authors-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, FormAuthorsComponent],
  templateUrl: './authors-edit.component.html',
})
export class AuthorsEditComponent implements OnInit {
  isModalOpen = false;
  author: Author | null = null;
  @ViewChild(FormAuthorsComponent) formAuthorsComponent!: FormAuthorsComponent;

  private authorService = inject(AuthorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getAuthorById(id);
  }

  /* 
  * Obtener autor que se va a modificar
  */
  getAuthorById(id: number) {
    this.authorService.getById(id).subscribe(response => {
      this.author = response.data.author;
      console.log(this.author);
    });
  }

  /** 
  * * Modificar autor
  * ? En este metodo se modifica al autor, en base a los valores del form, y luego se maneja la respuesta o el error, yendo al handle correspondiente
  */
  update(formValue: { name: string; lastName: string; nationalityId: number; note: string }): void {
    const { name, lastName, nationalityId, note } = formValue;
    this.authorService.update(this.author?.id ?? 0, name, lastName, nationalityId, note, this.formAuthorsComponent.photoName || '')
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
      this.formAuthorsComponent.generalErrors = [];
      console.log(error.message)
      if (error.status === 400 && error.error?.errors) {
        const errorMessages = error.error.errors;
  
        errorMessages.forEach((message: string) => {
          this.formAuthorsComponent.generalErrors.push(message);
        });
      } else {
        this.formAuthorsComponent.generalErrors.push("Ocurrió un error inesperado. Inténtalo de nuevo más tarde.");
      }
    }

  //#region Manejo del modal
  openModal() {
    this.isModalOpen = true;
  }

  handleConfirm() {
    this.isModalOpen = false;
    this.router.navigate(['/admin/authors/edit', this.author?.id ?? 0]);
  }

  handleCancel() {
    this.isModalOpen = false;
    this.router.navigate(['admin/authors']);
  }
  //#endregion
}
