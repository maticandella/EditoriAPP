import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../../interfaces/Book';

@Component({
  selector: 'app-modal-view-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-view-books.component.html',
  styleUrl: './modal-view-books.component.css'
})
export class ModalViewBooksComponent {
  @Input() open = false; 
  @Input() books: Book[] | null = null;

  closeModal() {
    this.open = false;
  }
}
