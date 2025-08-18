import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/account';  // url from the launch setting json file and account endpoint
  private token = "token"; // declaring variable to store token value

  private httpClient = inject(HttpClient); // injecting the httpclient


  // Register method implementation
  register(data: FormData): Observable<ApiResponse<string>>{
    return this.httpClient
    .post<ApiResponse<string>>(`${this.baseUrl}/register`, data)
    .pipe(
      tap((response) =>{
        localStorage.setItem(this.token, response.data)
      })
    );
  }


  // Login method implementation
  loginUser(data: FormData): Observable<ApiResponse<string>>{
    return this.httpClient
    .post<ApiResponse<string>>(`${this.baseUrl}/login`, data)
    .pipe(
      tap((response) => {
        if(response.isSuccess){
          localStorage.setItem(this.token, response.data);
        }
        return response;
      })
    );
  }

  // Fetching user details method
  me():Observable<ApiResponse<User>>{
    return this.httpClient
    .get<ApiResponse<User>>(`${this.baseUrl}/me`, {
      headers: {
        Authorization: `Bearer ${this.getAccessToken}`, // authorizing so that unauthorized error doesnot show up in the console
      },
    })
    .pipe(
      tap((response) =>{
        if(response.isSuccess) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      })
    );
  }

  // re-usable method to get the value of token
  get getAccessToken(): string | null {
    return localStorage.getItem(this.token) || '';
  }

  isLoggedIn(): boolean{
    return !!localStorage.getItem(this.token);
  }

  logout(){
    localStorage.removeItem(this.token);
    localStorage.removeItem('user');
  }
}
