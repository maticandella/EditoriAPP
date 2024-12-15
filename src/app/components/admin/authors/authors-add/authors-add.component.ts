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
  photoName = '';
  isModalOpen = false;

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
    photo: new FormControl(''),
  });

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.photoName = file.name;
    }
  }

  create(formValue: { name: string; lastName: string; nationalityId: number; note: string }): void {
    const { name, lastName, nationalityId, note } = formValue;
    console.log(nationalityId)
    this.authorService.create(name, lastName, nationalityId, note, this.photoName || '')
      .subscribe(
        response => {
          if (response.status === 201) {
            this.newAuthorId = response.body || 0;
            this.openModal()
          }
        },
        error => {
          if (error.status === 400) {
            console.error('Error al crear el autor:', error.error?.message || 'Solicitud incorrecta.');
            alert(`Error 400: ${error.error?.message || 'Datos inválidos proporcionados.'}`);
          } else {
            console.error('Ocurrió un error inesperado:', error);
            alert('Ocurrió un error inesperado. Inténtalo de nuevo más tarde.');
          }
        }
      );
  }

  getCountries() {
    this.nationalityService.getAll().subscribe(response => {
      this.nationalities = response.data.nationalities;
    });
  }

  //INCORPORAR LAS REDES EN EL HTML, YA LAS TRAE BIEN
  getSocialMediaTypes() {
    this.socialMediaService.getAll().subscribe(response => {
      this.socialMediaTypes = response.data.socialMediaTypes;
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  handleConfirm() {
    this.isModalOpen = false;
    this.router.navigate(['admin/authors/add']);
    this.form.reset();
    console.log('Confirmed! Formulario vacío.');
  }

  handleCancel() {
    this.isModalOpen = false;
    this.router.navigate(['admin/authors']);
    console.log('Cancelled!');
  }
}