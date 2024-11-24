import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthorService } from '../../services/authors.service';
import { Router } from '@angular/router';
import { Author } from '../../interfaces/Author';
import { PaginationComponent } from './../../components/pagination/pagination.component';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule,PaginationComponent] ,
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css']
})
export class AuthorsComponent implements OnInit {
  authors: Author[] = [];
  totalPages: number = 1;
  totalAuthors: number = 0;
  currentPage: number = 1;
  name: string = '';
  selectedLetter: string = '';
  alphabet: string[] = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  
  private authorService = inject(AuthorService);
  private router = inject(Router);

  ngOnInit(): void {
    this.getAuthorsPaginated(this.currentPage, 10);
  }

  getAuthorsPaginated(page: number, limit: number) {
    this.authorService.getAll(page, limit).subscribe(response => {
      this.authors = response.data.items;
      this.totalPages = response.data.totalPages;
      this.totalAuthors = response.data.totalItems;
      this.currentPage = page;
    });
  }

  onPageChange(page: number): void {
    this.search(page, 10, this.name);
  }

  search(page: number, limit: number, name: string, letter: string = ''): void {
    this.authorService.search(page, limit, name, letter).subscribe(response => {
      this.authors = response.data.items;
      this.totalPages = response.data.totalPages;
      this.totalAuthors = response.data.totalItems;
      this.currentPage = page;
      this.selectedLetter = letter;
    });
  }

  filterByLetter(letter: string): void {
    this.search(1, 10, this.name, letter); 
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getAuthorsPaginated(this.currentPage, 10);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getAuthorsPaginated(this.currentPage, 10);
    }
  }
}
