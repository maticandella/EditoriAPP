import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  menuOpen = false;
  navLinks = [
    { href: 'authors', text: 'Autores' },
    { href: 'books', text: 'Libros' },
    { href: '#review', text: 'Sobre Nosotros' }
  ];

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
