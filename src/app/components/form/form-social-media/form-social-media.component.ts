import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SocialMediaType } from '../../../interfaces/SocialMediaType';
import { SocialMedia } from '../../../interfaces/SocialMedia';
import { Author } from '../../../interfaces/Author';
import { SocialMediaService } from '../../../services/socialMedia.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-social-media',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-social-media.component.html'
})
export class FormSocialMediaComponent implements OnInit, OnChanges {
  @Input() author: Author | null = null;
  @Output() formSubmit = new EventEmitter<any>();
  
  socialMediaTypes: SocialMediaType[] = [];
  socialLinks: SocialMedia[] = [];
  showSocialLinks = false;
  visibleInputs: boolean[] = [];
  generalErrors: string[] = [];

  private socialMediaService = inject(SocialMediaService);

  form: FormGroup = new FormGroup({
    socialLinks: new FormControl(''),
  });

  ngOnInit(): void {
    this.getSocialMediaTypes().then(() => {
      if (this.author) {
        this.ngOnChanges({ author: { currentValue: this.author, previousValue: null, firstChange: true, isFirstChange: () => true } });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['author'] && this.author) {
      this.socialLinks = this.author.socialMediaAccounts ?? [];
      this.visibleInputs = this.socialMediaTypes.map(type =>
        this.socialLinks.some(link => link.socialMediaTypeId === type.id)
      );
    }
  }

  /* 
  * Obtener todas las redes sociales disponibles
  */
  getSocialMediaTypes(): Promise<void> {
    return new Promise(resolve => {
      this.socialMediaService.getAll().subscribe(response => {
        this.socialMediaTypes = response.data.socialMediaTypes;
        this.visibleInputs = new Array(this.socialMediaTypes.length).fill(false);
        resolve();
      });
    });
  }

  toggleSocialLinks() {
    this.showSocialLinks = !this.showSocialLinks;
  }

  onSocialLinkChange(url: string, socialMediaTypeId: number): void {
    if (!this.socialLinks) {
      this.socialLinks = [];
    }

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

  getSocialLinkUrl(socialMediaTypeId: number): string {
    return (
      this.socialLinks?.find(link => link.socialMediaTypeId === socialMediaTypeId)?.url || ''
    );
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

  OnSubmit() {
    const formValue = this.form.value;
    const dataToEmit = {
      ...formValue,
      socialLinks: this.socialLinks,
      socialMediaTypes: this.socialMediaTypes
    };
    this.formSubmit.emit(dataToEmit);
  }
}
