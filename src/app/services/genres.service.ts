import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Observable } from 'rxjs';
import { Response } from '../interfaces/response/Response';
import { GenreResponse } from '../interfaces/response/GenreResponse';

@Injectable({
    providedIn: 'root'
  })
  export class GenreService {
    private baseUrl:string = appsettings.apiUrl;
  
    constructor(private http: HttpClient) {}

    getAll(): Observable<Response<GenreResponse>> {
        return this.http.get<Response<GenreResponse>>(`${this.baseUrl}/genres`);
    }
}
