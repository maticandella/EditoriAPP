import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Book } from '../../interfaces/Book';
import { BookService } from '../../services/books.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PaginationComponent } from './../../components/pagination/pagination.component';
import { GenreService } from '../../services/genres.service';
import { Genre } from '../../interfaces/Genre';
import { ShoppingCartService } from '../../services/shoppingCart.service';

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
  showToast: boolean = false;
  toastMessage: string = '';
  private toastQueue: string[] = [];
  private toastTimeout: any;

  private bookService = inject(BookService);
  private genreService = inject(GenreService);
  private shoppingCartService = inject(ShoppingCartService)
  //private router = inject(Router);
  private route = inject(ActivatedRoute);

  // ngOnInit(): void {
  //   this.getBooksPaginated(this.currentPage, 12);
  //   this.getGenres();
  // }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const genreId = params['genre'];
      if (genreId) {
        this.selectedCategories = [parseInt(genreId, 10)];
        this.search(this.currentPage, 12, '', this.selectedCategories);
      }
      else{
        this.getBooksPaginated(this.currentPage, 12);
      }
    });
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

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.search(this.currentPage, 12, this.title, this.selectedCategories);
  }

  toggleCategory(categoryId: number): void {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index === -1) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories.splice(index, 1);
    }
    this.search(this.currentPage, 12, '', this.selectedCategories); 
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getBooksPaginated(this.currentPage, 12);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getBooksPaginated(this.currentPage, 12);
    }
  }

  addToShoppingCart(book: Book) {
    this.shoppingCartService.addToCart(book, 1);
    this.showToastMessage(`${book.title} fue añadido al carrito de compras.`);
  }

  showToastMessage(message: string) {
    if (this.showToast) {
      this.toastQueue.push(message); //Cola de mensajes, para que no se pisen uno con otro
    } else {
      this.toastMessage = message;
      this.showToast = true;
  
      this.toastTimeout = setTimeout(() => {
        this.showToast = false;
  
        if (this.toastQueue.length > 0) {
          const nextMessage = this.toastQueue.shift();
          this.showToastMessage(nextMessage!);
        }
      }, 3000);
    }
  }
}
