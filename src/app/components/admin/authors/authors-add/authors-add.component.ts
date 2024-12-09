import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorService } from '../../../../services/authors.service';
import { NationalityService } from './../../../../services/nationality.service';
import { catchError, of } from 'rxjs';
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
  private authorService = inject(AuthorService);
  private nationalityService = inject(NationalityService);

  ngOnInit(): void {
    this.getCountries();
  }

  create(formValue: { name: string; lastName: string; nationalityId: number; note: string; photo: string }): void {
    const { name, lastName, nationalityId, note, photo } = formValue;
    this.authorService.create(name, lastName, nationalityId, note, photo || '')
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