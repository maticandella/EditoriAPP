import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @HostListener('document:click', ['$event'])
  

  onClickOutside(event: MouseEvent) {
    // Lógica para determinar si el clic fue fuera de tu elemento
    console.log('Clicked outside');
  }

  onClickInside() {
    console.log('Clicked inside');
  }
}