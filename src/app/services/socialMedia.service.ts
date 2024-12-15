import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { map, Observable } from 'rxjs';
import { Response } from '../interfaces/response/Response';
import { SocialMediaResponse } from '../interfaces/response/SocialMediaResponse';


@Injectable({
    providedIn: 'root'
  })
  export class SocialMediaService {
    private baseUrl:string = appsettings.apiUrl;
  
    constructor(private http: HttpClient) {}

    getAll(): Observable<Response<SocialMediaResponse>> {
      return this.http.get<Response<SocialMediaResponse>>(`${this.baseUrl}/socialmediatypes`).pipe(
        map(response => {
          response.data.socialMediaTypes.sort((a, b) => a.name.localeCompare(b.name));
          return response;
        })
    )};
}