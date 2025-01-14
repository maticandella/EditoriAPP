import { Component, inject } from '@angular/core';
import { Author } from '../../../../interfaces/Author';
import { AuthorService } from '../../../../services/authors.service';
import { CommonModule } from '@angular/common';
import { Book } from '../../../../interfaces/Book';
import { BookService } from '../../../../services/books.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  authors: Author[] = [];
  books: Book[] = [];

  private authorService = inject(AuthorService);
  private bookService = inject(BookService);

  ngOnInit(): void {
    this.getLastAuthors(1, 5);
    this.getLastBooks(1, 5);
  }

  getLastAuthors(page: number, limit: number): void {
    this.authorService.getAll(page, limit).subscribe(response => {
      this.authors = response.data.items;
    });
  }

  getLastBooks(page: number, limit: number): void {
    this.bookService.getAll(page, limit).subscribe(response => {
      this.books = response.data.items;
    });
  }
}
