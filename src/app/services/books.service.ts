import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Observable } from 'rxjs';
import { Response } from '../interfaces/response/Response';
import { BookResponse } from '../interfaces/response/BookResponse';
import { BookByAuthorResponse } from '../interfaces/response/BookByAuthorResponse';
import { BookPaginatedResponse } from '../interfaces/response/BookPaginatedResponse';

@Injectable({
    providedIn: 'root'
  })
  export class BookService {
    private adminUrl:string = appsettings.adminUrl;
    private baseUrl:string = appsettings.apiUrl;
  
    constructor(private http: HttpClient) {}

    create(title: string, authorId: number, genreId: number, editionId: number, photo: string, isbn: string, pagesNumber: number, year: number, review: string, price: number): Observable<HttpResponse<{ data: { id: number } }>> {
          return this.http.post<{ data: { id: number } }>(
            `${this.adminUrl}/books`,
            {
              title: title,
              authorId: authorId,
              genreId: genreId,
              editionId: editionId,
              photo: photo,
              isbn: isbn,
              pagesNumber: pagesNumber,
              year: year,
              review: review,
              price: price
            },
            {
              withCredentials: true,
              observe: 'response'
            }
          );
        }

    getById(id: number): Observable<Response<BookResponse>> {
      return this.http.get<Response<BookResponse>>(`${this.baseUrl}/books/${id}`);
    }

    getByAuthorId(authorId: number): Observable<Response<BookByAuthorResponse>> {
      return this.http.get<Response<BookByAuthorResponse>>(`${this.baseUrl}/books/author/${authorId}`);
    }

    getAll(page: number = 1, limit: number = 10): Observable<BookPaginatedResponse> {
      return this.http.get<BookPaginatedResponse>(`${this.baseUrl}/books`, {
        params: {
          page: page.toString(),
          limit: limit.toString()
        }
      });
    }

    search(page: number = 1, limit: number = 10, title = '', categories: number[ ]= []): Observable<BookPaginatedResponse> {
      return this.http.get<BookPaginatedResponse>(`${this.baseUrl}/books/search`, {
        params: {
          page: page.toString(),
          limit: limit.toString(),
          title: title,
          categories: categories
        }
      });
    }
}
