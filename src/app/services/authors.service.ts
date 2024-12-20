import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { map, Observable } from 'rxjs';
import { Response } from '../interfaces/response/Response';
import { AuthorPaginatedResponse } from '../interfaces/response/AuthorPaginatedResponse';
import { AuthorResponse } from '../interfaces/response/AuthorResponse';
import { SocialMedia } from '../interfaces/SocialMedia';
import { ErrorResponse } from '../interfaces/response/ErrorResponse';


@Injectable({
    providedIn: 'root'
  })
  export class AuthorService {
    private adminUrl:string = appsettings.adminUrl;
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

    create(name: string, lastName: string, nationalityId: number, note: string, photo: string): Observable<HttpResponse<{ data: { id: number } }>> {
      return this.http.post<{ data: { id: number } }>(
        `${this.adminUrl}/authors`,
        {
          name: name,
          lastName: lastName,
          nacionalityId: nationalityId,
          note: note,
          photo: photo
        },
        {
          withCredentials: true,
          observe: 'response'
        }
      );
    }

    delete(id: number): Observable<HttpResponse<ErrorResponse>> {
      return this.http.delete<ErrorResponse>(
        `${this.adminUrl}/authors/${id}`,
        {
          withCredentials: true,
          observe: 'response'
        }
      );
    }

    addSocialMedia(id: number, socialMedia: SocialMedia[]): Observable<Response<number>> {
      return this.http.post<Response<number>>(
        `${this.adminUrl}/authors/${id}/socialmedia`,
        socialMedia,
        {
          withCredentials: true,
          observe: 'response'
        }
      ).pipe(
        map(response => response.body as Response<number>) 
      );
    }
}