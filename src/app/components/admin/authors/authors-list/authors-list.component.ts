import { Author } from './../../../../interfaces/Author';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthorService } from '../../../../services/authors.service';

@Component({
  selector: 'app-authors-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule] ,
  templateUrl: './authors-list.component.html',
  styleUrl: './authors-list.component.css'
})
export class AuthorsListComponent implements OnInit {
  authors: Author[] = [];
  totalPages: number = 1;
  totalAuthors: number = 0;
  currentPage: number = 1;
  name: string = '';
  selectedLetter: string = '';
  
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
}
