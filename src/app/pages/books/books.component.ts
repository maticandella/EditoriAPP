import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Book } from '../../interfaces/Book';
import { BookService } from '../../services/books.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PaginationComponent } from './../../components/pagination/pagination.component';
import { GenreService } from '../../services/genres.service';
import { Genre } from '../../interfaces/Genre';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, PaginationComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  genres: Genre[] = [];
  title: string = '';
  selectedCategories: number[] = []; // Guardo las categorías seleccionadas
  totalPages: number = 1;
  totalAuthors: number = 0;
  currentPage: number = 1;

  private bookService = inject(BookService);
  private genreService = inject(GenreService);
  private router = inject(Router);

  ngOnInit(): void {
    this.getBooksPaginated(this.currentPage, 10);
    this.getGenres();
  }

  getBooksPaginated(page: number, limit: number) {
    this.bookService.getAll(page, limit).subscribe(response => {
      this.books = response.data.items;
      this.totalPages = response.data.totalPages;
      this.totalAuthors = response.data.totalItems;
      this.currentPage = page;
    });
  }

  getGenres() {
    this.genreService.getAll().subscribe(response => {
      this.genres = response.data.genres;
      this.genres = this.sortGenresByDescription(response.data.genres);
    });
  }

  sortGenresByDescription(genres: Genre[]): Genre[] {
    return genres.sort((a, b) => a.description.localeCompare(b.description));
  }

  search(page: number, limit: number, title: string, categories: number[] = []): void {
    this.bookService.search(page, limit, title, categories).subscribe(response => {
      this.books = response.data.items;
      this.totalPages = response.data.totalPages;
      this.totalAuthors = response.data.totalItems;
      this.currentPage = page;
    });
  }

  toggleCategory(categoryId: number): void {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index === -1) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories.splice(index, 1);
    }
    this.search(this.currentPage, 10, '', this.selectedCategories); 
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getBooksPaginated(this.currentPage, 10);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getBooksPaginated(this.currentPage, 10);
    }
  }
}
