import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Observable } from 'rxjs';
import { Response } from '../interfaces/response/Response';
import { Auth } from '../interfaces/Auth';

@Injectable({
    providedIn: 'root'
  })
  export class AuthService {
    private apiUrl:string = appsettings.apiUrl;
    private adminUrl:string = appsettings.adminUrl;
  
    constructor(private http: HttpClient) {}

    login(email: string, password: string): Observable<Response<Auth>> {
        return this.http.post<Response<Auth>>(`${this.apiUrl}/login`,
            {
                email: email, 
                password: password
            },
            { withCredentials: true }
        );
    }

    validateSession(): Observable<boolean> {
        return this.http.get<boolean>(`${this.adminUrl}/users/validatesession`,
            { withCredentials: true }
        );
    }

    logout(): Observable<Response<null>> {
        return this.http.post<Response<null>>(`${this.adminUrl}/users/logout`,
            {},
            { withCredentials: true }
        );
    }

    requestResetPassword(email: string): Observable<Response<null>> {
        return this.http.post<Response<null>>(`${this.apiUrl}/requestresetpassword`,
            {
                email: email
            }
        );
    }

    resetPassword(token: string, newPassword: string): Observable<Response<null>> {
        return this.http.post<Response<null>>(`${this.apiUrl}/resetpassword`,
            {
                token, newPassword
            }
        );
    }
}
