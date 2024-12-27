import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Response } from '../interfaces/response/Response';
import { EditionResponse } from '../interfaces/response/EditionResponse';

@Injectable({
  providedIn: 'root'
})
export class EditionService {
  private baseUrl:string = appsettings.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Response<EditionResponse>> {
      return this.http.get<Response<EditionResponse>>(`${this.baseUrl}/editions`);
  }
}
