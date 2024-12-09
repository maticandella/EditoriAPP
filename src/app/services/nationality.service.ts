import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { map, Observable } from 'rxjs';
import { Response } from '../interfaces/response/Response';
import { NationalityResponse } from '../interfaces/response/NationalityResponse';


@Injectable({
    providedIn: 'root'
  })
  export class NationalityService {
    private baseUrl:string = appsettings.apiUrl;
  
    constructor(private http: HttpClient) {}

    getAll(): Observable<Response<NationalityResponse>> {
      return this.http.get<Response<NationalityResponse>>(`${this.baseUrl}/nationalities`).pipe(
        map(response => {
          response.data.nationalities.sort((a, b) => a.name.localeCompare(b.name));
          return response;
        })
    )};
}