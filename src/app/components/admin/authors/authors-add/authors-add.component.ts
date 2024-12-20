import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorService } from '../../../../services/authors.service';
import { NationalityService } from './../../../../services/nationality.service';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { Nationality } from '../../../../interfaces/Nationality';
import { ModalComponent } from "../../../modal-add/modal-add.component";
import { Router } from '@angular/router';
import { SocialMediaService } from '../../../../services/socialMedia.service';
import { SocialMediaType } from '../../../../interfaces/SocialMediaType';
import { SocialMedia } from '../../../../interfaces/SocialMedia';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-authors-add',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './authors-add.component.html',
  styleUrl: './authors-add.component.css'
})
export class AuthorsAddComponent implements OnInit {
  newAuthorId = 0;
  nationalities: Nationality[] = [];
  socialMediaTypes: SocialMediaType[] = [];
  socialLinks: SocialMedia[] = [];
  photoName = '';
  isModalOpen = false;
  showSocialLinks = false;
  visibleInputs: boolean[] = [];
  generalErrors: string[] = [];

  private authorService = inject(AuthorService);
  private nationalityService = inject(NationalityService);
  private socialMediaService = inject(SocialMediaService);
  private router = inject(Router)

  ngOnInit(): void {
    this.getCountries();
    this.getSocialMediaTypes();
  }

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    nationalityId: new FormControl('', [Validators.required, Validators.min(1)]),
    note: new FormControl(null),
    photo: new FormControl(null),
    socialLinks: new FormControl(''),
  });

  //#region Metodos para el OnInit
  /* 
  * Obtener todos los países disponibles
  */
  getCountries() {
    this.nationalityService.getAll().subscribe(response => {
      this.nationalities = response.data.nationalities;
    });
  }

  /* 
  * Obtener todas las redes sociales disponibles
  */
  getSocialMediaTypes() {
    this.socialMediaService.getAll().subscribe(response => {
      this.socialMediaTypes = response.data.socialMediaTypes;
      this.visibleInputs = new Array(this.socialMediaTypes.length).fill(false);
    });
  }
  //#endregion

  /** 
  * * Cuando el usuario selecciona una foto, se ejecuta en el change del input
  * ? Se toma el nombre + extensión del archivo
  */
  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.photoName = file.name;
    }
  }

  /** 
  * * Crear autor
  * ? En este metodo creo al autor, en base a los valores del form, y luego se maneja la respuesta o el error, yendo al handle correspondiente
  */
  create(formValue: { name: string; lastName: string; nationalityId: number; note: string }): void {
    const { name, lastName, nationalityId, note } = formValue;
    this.authorService.create(name, lastName, nationalityId, note, this.photoName || '')
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
    this.generalErrors = [];

    if (error.status === 400 && error.error?.errors) {
      const errorMessages = error.error.errors;

      errorMessages.forEach((message: string) => {
        this.generalErrors.push(message);
      });
    } else {
      this.generalErrors.push("Ocurrió un error inesperado. Inténtalo de nuevo más tarde.");
    }
  }

  /**
   * * Metodo para añadir las redes sociales al autor
   * ? (en caso de que el array contenga valores)
   */
  private addSocialMediaIfNeeded(): void {
    if (this.socialMediaTypes.length > 0 && this.socialLinks.length > 0) {
      this.authorService.addSocialMedia(this.newAuthorId, this.socialLinks)
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
    this.socialLinks = [];
    this.visibleInputs = [];
    this.form.reset();
  }

  handleCancel() {
    this.isModalOpen = false;
    this.router.navigate(['admin/authors']);
    console.log('Cancelled!');
  }
  //#endregion

  //#region Manejo de Social Links
  toggleSocialLinks() {
    this.showSocialLinks = !this.showSocialLinks;
  }

  onSocialLinkChange(url: string, socialMediaTypeId: number): void {
    // Busca si ya existe un objeto con el mismo 'type'
    const existingIndex = this.socialLinks.findIndex(social => social.socialMediaTypeId === socialMediaTypeId);
  
    if (url) {
      if (existingIndex > -1) {
        // Si ya existe, lo actualiza
        this.socialLinks[existingIndex].url = url;
      } else {
        // Si no existe, agrega un nuevo objeto
        this.socialLinks.push({ url, socialMediaTypeId });
      }
    } else {
      // Si se elimina la URL, quita el objeto del array
      this.socialLinks.splice(existingIndex, 1);
    }
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value || '';
  }

  toggleInputSocial(index: number): void {
    this.visibleInputs[index] = !this.visibleInputs[index];
  
    // Si se oculta el input, elimina la red social del array
    if (!this.visibleInputs[index]) {
      const typeToRemove = this.socialMediaTypes[index].id;
      this.socialLinks = this.socialLinks.filter(social => social.socialMediaTypeId !== typeToRemove);
    }
  }
  
  removeSocialLink(index: number): void {
    const typeToRemove = this.socialMediaTypes[index].id;
    // Elimina el input y quita el objeto del array
    this.visibleInputs[index] = false;
    this.socialLinks = this.socialLinks.filter(social => social.socialMediaTypeId !== typeToRemove);
  }
  //#endregion
}