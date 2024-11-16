import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Observable } from 'rxjs';
import { Response } from '../interfaces/response/Response';
import { BookResponse } from '../interfaces/response/BookResponse';
import { BookByAuthorResponse } from '../interfaces/response/BookByAuthorResponse';

@Injectable({
    providedIn: 'root'
  })
  export class BookService {
    private baseUrl:string = appsettings.apiUrl;
  
    constructor(private http: HttpClient) {}

    getById(id: number): Observable<Response<BookResponse>> {
      return this.http.get<Response<BookResponse>>(`${this.baseUrl}/books/${id}`);
    }

    getByAuthorId(authorId: number): Observable<Response<BookByAuthorResponse>> {
      return this.http.get<Response<BookByAuthorResponse>>(`${this.baseUrl}/books/author/${authorId}`);
    }
}
