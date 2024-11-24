import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Observable } from 'rxjs';
import { Response } from '../interfaces/response/Response';
import { AuthorPaginatedResponse } from '../interfaces/response/AuthorPaginatedResponse';
import { AuthorResponse } from '../interfaces/response/AuthorResponse';


@Injectable({
    providedIn: 'root'
  })
  export class AuthorService {
    private baseUrl:string = appsettings.apiUrl;
  
    constructor(private http: HttpClient) {}

    getById(id: number): Observable<Response<AuthorResponse>> {
      return this.http.get<Response<AuthorResponse>>(`${this.baseUrl}/authors/${id}`);
    }

    getAll(page: number = 1, limit: number = 10): Observable<AuthorPaginatedResponse> {
      return this.http.get<AuthorPaginatedResponse>(`${this.baseUrl}/authors`, {
        params: {
          page: page.toString(),
          limit: limit.toString()
        }
      });
    }

    search(page: number = 1, limit: number = 10, name = '', initial= ''): Observable<AuthorPaginatedResponse> {
      return this.http.get<AuthorPaginatedResponse>(`${this.baseUrl}/authors/search`, {
        params: {
          page: page.toString(),
          limit: limit.toString(),
          name: name,
          initial: initial
        }
      });
    }
}