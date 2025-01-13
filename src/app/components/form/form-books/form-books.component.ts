import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Author } from '../../../interfaces/Author';
import { Book } from '../../../interfaces/Book';
import { GenreService } from '../../../services/genres.service';
import { Genre } from '../../../interfaces/Genre';
import { EditionService } from '../../../services/edition.service';
import { Edition } from '../../../interfaces/Edition';
import { AuthorService } from '../../../services/authors.service';

@Component({
  selector: 'app-form-books',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-books.component.html'
})
export class FormBooksComponent implements OnInit, OnChanges {
  @Input() author: Author | null = null;
  @Input() book: Book | null = null;
  @Output() formSubmit = new EventEmitter<any>();

  photoName = '';
  generalErrors: string[] = [];
  authors: Author[] = [];
  editions: Edition[] = [];
  genres: Genre[] = [];

  private authorService = inject(AuthorService);
  private editionService = inject(EditionService);
  private genreService = inject(GenreService);

  form: FormGroup = new FormGroup({
      title: new FormControl('', [Validators.required]),
      authorName: new FormControl({ value: '', disabled: true }, [Validators.required]),
      authorId: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.min(1)]),
      genreId: new FormControl('', [Validators.required]),
      editionId: new FormControl('', [Validators.required]),
      photo: new FormControl(null),
      isbn: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{9}[\dxX]|\d{13})$/)]),
      pagesNumber: new FormControl('', [Validators.required, Validators.min(1)]),
      year: new FormControl(null,  [Validators.min(1), Validators.max(new Date().getFullYear())]),
      review: new FormControl(null),
      price: new FormControl('', [Validators.required, Validators.min(0.01)])
    });

    ngOnInit(): void {
      this.getEditions();
      this.getGenres();
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['author'] && this.author) {
        this.form.patchValue({
          authorName: this.author.name + ' ' + this.author.lastName || '',
          authorId: this.author.id,
        });
        this.form.get('authorId')?.disable();
      }

      if (changes['book'] && this.book) {
        this.form.patchValue({
          title: this.book.title || '',
          authorId: this.book.authorId || '',
          genreId: this.book.genreId || '',
          editionId: this.book.editionId || '',
          photo: '',
          isbn: this.book.isbn || '',
          pagesNumber: this.book.pagesNumber || '',
          year: this.book.year || '',
          review: this.book.review || '',
          price: this.book.price || '',
        });
        this.photoName = this.book?.photo || '';
      }
    }

  //#region Metodos para el OnInit
  /* 
  * Obtener todos los tipos de edición
  */
  getEditions() {
    this.editionService.getAll().subscribe(response => {
      this.editions = response.data.editions;
    });
  }
  /* 
  * Obtener todos los géneros
  */
  getGenres() {
    this.genreService.getAll().subscribe(response => {
      this.genres = response.data.genres;
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

  searchAuthor(page: 1, limit: 100, name: string, letter: ''): void {
    this.authorService.search(page, limit, name, letter).subscribe(response => {
      this.authors = response.data.items;
    });
  }

  selectAuthor(author: Author): void {
    this.form.patchValue({
      authorName: `${author.name} ${author.lastName}`,
      authorId: author.id,
    });
    this.authors = [];
  }
  
  OnSubmit() {
    this.form.get('authorId')?.enable(); //Hablita el authorId antes de enviar el formulario, para poder obtener su valor
    const formValue = this.form.value;
    const dataToEmit = {
      ...formValue,
      photoName: this.photoName || '',
    };
    this.formSubmit.emit(dataToEmit);
  }
}
