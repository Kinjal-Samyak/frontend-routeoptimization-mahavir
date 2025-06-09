/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocalStoreService } from '../local-store.service';
import { AuthService } from 'src/app/shared/services/auth.service';
@Injectable()
export class ApiService implements OnInit {
    token: string;
    constructor(private http: HttpClient, private ls: LocalStoreService) {
        this.token = this.ls.getItem('token');
    }

    private formatErrors(error: any) {
        return throwError(error.error);
    }

    ngOnInit(): void {}

    // Get method for api calling
    get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
        return this.http
            .get(path, { params })
            .pipe(catchError(this.formatErrors));
    }

    // Put method for api calling
    put(path: string, body: Object = {}): Observable<any> {
        return this.http
            .put(path, JSON.stringify(body))
            .pipe(catchError(this.formatErrors));
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
        return this.http.post(path, body).pipe(catchError(this.formatErrors));
    }

    // Post Request To Auth Server method
    postToAuthServer(path: string, body: Object = {}): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
            }),
        };

        const otpt = this.http
            .post(path, body, httpOptions)
            .pipe(catchError(this.formatErrors));
        return otpt;
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

    delete(path: string): Observable<any> {
        return this.http.delete(path).pipe(catchError(this.formatErrors));
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
