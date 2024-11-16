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
    { href: 'home', text: 'Inicio' },
    { href: 'authors', text: 'Autores' },
    { href: '#popular', text: 'Libros' },
    { href: '#review', text: 'Sobre Nosotros' }
  ];

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
