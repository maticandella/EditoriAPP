import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorService } from '../../../../services/authors.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from "../../../modals/modal-add/modal-add.component";
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { FormAuthorsComponent } from "../../../form/form-authors/form-authors.component";

@Component({
  selector: 'app-authors-add',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, FormAuthorsComponent],
  templateUrl: './authors-add.component.html'
})
export class AuthorsAddComponent { 
  newAuthorId = 0;
  isModalOpen = false;
  @ViewChild(FormAuthorsComponent) formAuthorsComponent!: FormAuthorsComponent;

  private authorService = inject(AuthorService);
  private router = inject(Router)

  /** 
  * * Crear autor
  * ? En este metodo creo al autor, en base a los valores del form, y luego se maneja la respuesta o el error, yendo al handle correspondiente
  */
  create(formValue: { name: string; lastName: string; nationalityId: number; note: string }): void {
    const { name, lastName, nationalityId, note } = formValue;
    this.authorService.create(name, lastName, nationalityId, note, this.formAuthorsComponent.photoName || '')
      .subscribe({
          next: (response) => this.handleCreateSuccess(response),
          error: (error) => this.handleCreateError(error)
        });
  }

  /**
   * * Handle de respuesta exitosa (del create)
   * ? Acá en base al status 201 del POST de autores, vamos al addSocialMediaIfNeeded() en caso de ser necesario, y luego se hace el open del modal
   * @param response 
   */
  private handleCreateSuccess(response: HttpResponse<{ data: { id: number } }>): void {
    if(response.status === 201) {
      this.newAuthorId = response.body?.data?.id || 0;
      this.addSocialMediaIfNeeded();
      this.openModal();
    }
  }

  /**
   * * Handle de errores
   * ? En este handle se contemplan los errores que puedan venir por validaciones del API
   * @param error 
   */
  private handleCreateError(error: any): void {
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

  /**
   * * Metodo para añadir las redes sociales al autor
   * ? (en caso de que el array contenga valores)
   */
  private addSocialMediaIfNeeded(): void {
    if (this.formAuthorsComponent.socialMediaTypes.length > 0 && this.formAuthorsComponent.socialLinks.length > 0) {
      this.authorService.addSocialMedia(this.newAuthorId, this.formAuthorsComponent.socialLinks)
        .subscribe({
          next: () => console.log('Redes sociales agregadas exitosamente'),
          error: (error) => console.error('Error al agregar redes sociales:', error)
        });
    }
  }

  //#region Manejo del modal
  openModal() {
    this.isModalOpen = true;
  }

  handleConfirm() {
    this.isModalOpen = false;
    this.router.navigate(['admin/authors/add']);
    this.formAuthorsComponent.socialLinks = [];
    this.formAuthorsComponent.visibleInputs = [];
    this.formAuthorsComponent.form.reset();
  }

  handleCancel() {
    this.isModalOpen = false;
    this.router.navigate(['admin/authors']);
    console.log('Cancelled!');
  }
  //#endregion
}