import { Component, inject, OnInit } from '@angular/core';
import { Author } from '../../interfaces/Author';
import { AuthorService } from '../../services/authors.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '../../interfaces/response/Response';
import { AuthorResponse } from '../../interfaces/response/AuthorResponse';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/books.service';
import { BookByAuthorResponse } from '../../interfaces/response/BookByAuthorResponse';
import { Book } from '../../interfaces/Book';

@Component({
  selector: 'app-author-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './author-details.component.html',
  styleUrl: './author-details.component.css',
  schemas: []
})
export class AuthorDetailsComponent implements OnInit {
  author: Author = {} as Author;
  books: Book[] = [];
  showFlag: boolean = false;

  private authorService = inject(AuthorService);
  private bookService = inject(BookService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  

  ngOnInit(): void {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getAuthorById(id);
    this.getBooksByAuthorId(id);
  }

  getAuthorById(id: number): void {
    if (id) {
      this.authorService.getById(id).subscribe(
        (response: Response<AuthorResponse>) => {
          this.author = response.data.author;
          this.setFlagVisibility();
        },
        (error) => {
          console.error('Error fetching author details', error);
        }
      );
    } else {
      console.error('Invalid author id');
    }
  }

  getBooksByAuthorId(authorId: number): void {
    if (authorId) {
      this.bookService.getByAuthorId(authorId).subscribe(
        (response: Response<BookByAuthorResponse>) => {
          this.books = response.data.books;
          console.log(response.data.books)
        },
        (error) => {
          console.error('Error fetching author details', error);
        }
      );
    } else {
      console.error('Invalid author id');
    }
  }

  setFlagVisibility(): void {
    this.showFlag = !!this.author?.nationality?.flag;
  }
}
