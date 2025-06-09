/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocalStoreService } from './local-store.service';
@Injectable()
export class ApiService implements OnInit {
    token: any;
    constructor(private http: HttpClient) {
        this.token = sessionStorage.getItem('token');
    }

    private formatErrors(error: any) {
        return throwError(error.error);
    }

    ngOnInit(): void {}

    // Get method for api calling
    get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.token}`,
            }),
        };

        return this.http
            .get(path, httpOptions)
            .pipe(catchError(this.formatErrors));
    }

    // Put method for api calling
    put(path: string, body: Object = {}): Observable<any> {
        return this.http
            .put(path, JSON.stringify(body))
            .pipe(catchError(this.formatErrors));
    }

    // Put method for api calling
    putWithoutBody(path: string): Observable<any> {
        // You can replace {} with the data you want to send in the PUT request body
        const body = {}; // Replace with your request body data
        return this.http.put(path, body).pipe(catchError(this.formatErrors));
    }

    // Post method for api calling
    post(
        path: string,
        body: Object = {},
        httpOptions: Object
    ): Observable<any> {
        return this.http
            .post(path, JSON.stringify(body), httpOptions)
            .pipe(catchError(this.formatErrors));
    }

    postWithAuth(path: string, body: any): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.token}`,
            }),
        };

        return this.http
            .post(path, body, httpOptions)
            .pipe(catchError(this.formatErrors));
    }

    // Post Request To Auth Server method
    postToAuthServer(path: string, body: Object = {}): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
                Authorization: `Bearer ${this.token}`,
            }),
        };

        return this.http
            .post(path, body, httpOptions)
            .pipe(catchError(this.formatErrors));
    }

    postWithParamAndOptions(
        path: string,
        params: HttpParams,
        httpOptions: Object
    ): Observable<any> {
        return this.http
            .post(path, params, httpOptions)
            .pipe(catchError(this.formatErrors));
    }

    postWithBodyAndOptions(
        path: string,
        body: Object = {},
        httpOptions: Object
    ): Observable<any> {
        return this.http
            .post(path, JSON.stringify(body), httpOptions)
            .pipe(catchError(this.formatErrors));
    }

    delete(
        path: string,
        params: HttpParams = new HttpParams()
    ): Observable<any> {
        return this.http
            .delete(path, { params })
            .pipe(catchError(this.formatErrors));
    }

    deleteWithBody(path: string, body: any) {
        return this.http
            .delete(path, { body })
            .pipe(catchError(this.formatErrors));
    }

    postToHeaderAuth(path: string, body: Object = {}): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
            }),
            observe: 'response' as 'body',
        };

        const otpt = this.http
            .post(path, body, httpOptions)
            .pipe(catchError(this.formatErrors));
        return otpt;
    }
}
