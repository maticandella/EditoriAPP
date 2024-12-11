import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorService } from '../../../../services/authors.service';
import { NationalityService } from './../../../../services/nationality.service';
import { FormsModule } from '@angular/forms';
import { Nationality } from '../../../../interfaces/Nationality';

@Component({
  selector: 'app-authors-add',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './authors-add.component.html',
  styleUrl: './authors-add.component.css'
})
export class AuthorsAddComponent implements OnInit {
  newAuthorId = 0;
  nationalities: Nationality[] = [];
  photoName = '';
  private authorService = inject(AuthorService);
  private nationalityService = inject(NationalityService);

  ngOnInit(): void {
    this.getCountries();
  }

  //FALTA VALIDAR FORM COMO HICE EN LOGIN
  //FALTA RESPONDER CON UN MODAL CUANDO DAS DE ALTA AL AUTOR , OPCIONES: https://www.creative-tim.com/twcomponents/component/modal-13 O https://www.creative-tim.com/twcomponents/component/tailwind-css-modal-popup

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.photoName = file.name;
    }
  }

  create(formValue: { name: string; lastName: string; nationalityId: number; note: string }): void {
    const { name, lastName, nationalityId, note } = formValue;
    this.authorService.create(name, lastName, nationalityId, note, this.photoName || '')
      .subscribe(
        response => {
          if (response.status === 201) {
            this.newAuthorId = response.body || 0;
            console.log(`Autor creado con éxito. ID: ${this.newAuthorId}`);
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
}