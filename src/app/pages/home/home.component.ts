import { Genre } from './../../interfaces/Genre';
import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, inject } from '@angular/core';
import Swiper, { Navigation, Pagination } from 'swiper';
import { GenreService } from '../../services/genres.service';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/books.service';
import { Book } from '../../interfaces/Book';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  private genreService = inject(GenreService);
  private bookService = inject(BookService);
  genres: Genre[] = [];
  books: Book[] = [];

  ngOnInit(): void {
    this.getGenres();
    this.getBooksPaginated(1, 8);
  }

  ngAfterViewInit(): void {
    new Swiper('.multiple-slide-hero-carousel', {
      modules: [Pagination],
      loop: true,
      slidesPerView: 1,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });

    new Swiper('.multiple-slide-carousel', {
      modules: [Navigation],
      loop: true,
      slidesPerView: 1, // Valor por defecto para pantallas pequeñas
      spaceBetween: 10, // Espaciado base
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        576: { slidesPerView: 1, spaceBetween: 10 }, // Pantallas pequeñas (mobile)
        768: { slidesPerView: 2, spaceBetween: 15 }, // Pantallas medianas (tablets)
        1024: { slidesPerView: 3, spaceBetween: 20 }, // Pantallas grandes (laptops)
        1440: { slidesPerView: 4, spaceBetween: 30 }, // Pantallas extra grandes (desktops grandes)
        1920: { slidesPerView: 5, spaceBetween: 40 }, // Pantallas ultra grandes (4K)
      },
    });
  }

  getBooksPaginated(page: number, limit: number) {
    this.bookService.getAll(page, limit).subscribe(response => {
      this.books = response.data.items;
    });
  }

  getGenres(): void {
    this.genreService.getAll().subscribe({
      next: (response) => {
        this.genres = response.data.genres;
      }
    });
  } 
}
