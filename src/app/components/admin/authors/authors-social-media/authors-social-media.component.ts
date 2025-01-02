import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormSocialMediaComponent } from "../../../form/form-social-media/form-social-media.component";
import { AuthorService } from '../../../../services/authors.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Author } from '../../../../interfaces/Author';
import { SocialMedia } from '../../../../interfaces/SocialMedia';
import { ModalComponent } from "../../../modals/modal-add/modal-add.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authors-social-media',
  standalone: true,
  imports: [CommonModule, FormSocialMediaComponent, ModalComponent],
  templateUrl: './authors-social-media.component.html'
})
export class AuthorsSocialMediaComponent implements OnInit {
  isModalOpen = false;
  author: Author | null = null;

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
    });
  }

  /** 
  * * Agregar/Modificar redes sociales del autor
  * ? En este metodo se agregan/modifican las redes sociales del autor, en base a los valores del form, y luego se maneja la respuesta o el error, yendo al handle correspondiente
  */
  addSocialMedia(formValue: { socialLinks: SocialMedia[] }): void {
    if (formValue.socialLinks.length > 0 && this.author?.id != undefined) {
      this.authorService.addSocialMedia(this.author?.id, formValue.socialLinks)
        .subscribe({
          next: () => this.openModal(),
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
  }

  handleCancel() {
    this.isModalOpen = false;
    this.router.navigate(['admin/authors']);
  }
  //#endregion
}
