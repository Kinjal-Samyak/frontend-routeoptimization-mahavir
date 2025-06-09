/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LocalStoreService } from './local-store.service';
import { User } from 'src/app/shared/model/user.model';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadConfigurationsService } from './load-configurations.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private user: User = {};

    responseData: any;
    constructor(
        private apiService: ApiService,
        private ls: LocalStoreService,
        private loadUrlService: LoadConfigurationsService
    ) {}

    // Set token to Session storage
    setToken(token: any) {
        sessionStorage.setItem('token', token);
    }

    // get token to Session storage
    getToken() {
        return sessionStorage.getItem('token');
    }

    // Check if token is in Session storage
    isLogedIn() {
        return this.getToken() !== null;
    }

    // Check if token is in Session storage
    logOut() {
        let reqObj = {
            app: 'web',
        };
        const url = this.loadUrlService.serviceUrl('authAPI') + `/Logout`;

        return this.apiService.postToAuthServer(url, reqObj).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    // Login API service
    login(loginData: any): Observable<any> {
        let obj = {
            userName: loginData.userName,
            password: loginData.password,
            app: 'web',
        };
        const url = this.loadUrlService.serviceUrl('authAPI') + `/Login`;

        return this.apiService.postToHeaderAuth(url, obj).pipe(
            map((res: any) => {
                if (res) {
                    console.log(res);
                    // You can access the headers from the HttpResponse object
                    const headers: HttpHeaders = res.headers;
                    // Retrieve a specific header value
                    this.setToken(
                        res.headers.get('Authorization').replace('Bearer ', '')
                    );
                    if (loginData.rememberMeCheck == true) {
                        this.ls.setItem('rememberedCredentials', loginData);
                    }
                }
                return res;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }
}
