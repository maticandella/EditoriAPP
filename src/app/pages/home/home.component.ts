import { Genre } from './../../interfaces/Genre';
import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, inject } from '@angular/core';
import Swiper, { Navigation } from 'swiper';
import { GenreService } from '../../services/genres.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  private genreService = inject(GenreService);
  genres: Genre[] = [];

  ngOnInit(): void {
    this.getGenres();
  }

  ngAfterViewInit(): void {
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

  getGenres(): void {
    this.genreService.getAll().subscribe({
      next: (response) => {
        this.genres = response.data.genres;
      }
    });
  }
}
