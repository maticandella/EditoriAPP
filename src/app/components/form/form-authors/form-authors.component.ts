import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NationalityService } from '../../../services/nationality.service';
import { SocialMediaService } from '../../../services/socialMedia.service';
import { Nationality } from '../../../interfaces/Nationality';
import { SocialMediaType } from '../../../interfaces/SocialMediaType';
import { SocialMedia } from '../../../interfaces/SocialMedia';
import { Author } from '../../../interfaces/Author';

@Component({
  selector: 'app-form-authors',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-authors.component.html'
})
export class FormAuthorsComponent implements OnInit, OnChanges {
  @Input() author: Author | null = null;
  @Output() formSubmit = new EventEmitter<any>();

  nationalities: Nationality[] = [];
  socialMediaTypes: SocialMediaType[] = [];
  socialLinks: SocialMedia[] = [];
  photoName = '';
  showSocialLinks = false;
  visibleInputs: boolean[] = [];
  generalErrors: string[] = [];

  private nationalityService = inject(NationalityService);
  private socialMediaService = inject(SocialMediaService);

  form: FormGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      nationalityId: new FormControl('', [Validators.required, Validators.min(1)]),
      note: new FormControl(null),
      photo: new FormControl(null),
      socialLinks: new FormControl(''),
    });

    ngOnInit(): void {
      this.getCountries();
      this.getSocialMediaTypes();
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['author'] && this.author) {
        this.form.setValue({
          name: this.author.name || '',
          lastName: this.author.lastName || '',
          note: this.author.note || '',
          nationalityId: this.author.nacionalityId || '',
          photo: '',
          socialLinks: '',
        });
        this.photoName = this.author?.photo || '';
        console.log(this.photoName)
      }
    }

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

  //#region Foto
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
  
  OnSubmit() {
    const formValue = this.form.value;
    const dataToEmit = {
      ...formValue,
      photoName: this.photoName || '',
      socialLinks: this.socialLinks,
      nationalities: this.nationalities,
      socialMediaTypes: this.socialMediaTypes,
      visibleInputs: this.visibleInputs
    };
    this.formSubmit.emit(dataToEmit);
  }
}
