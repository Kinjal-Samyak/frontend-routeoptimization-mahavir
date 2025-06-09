/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private jwtAuth: AuthService, private router: Router) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (!req.headers.has('Content-Type')) {
            const getToken: any = this.jwtAuth.getToken();
            if (!(req.body instanceof FormData)) {
                req = req.clone({
                    headers: req.headers.set(
                        'Content-Type',
                        'application/json;charset=utf-8'
                    ),
                });
            }

            if (getToken) {
                req = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${getToken}`,
                    },
                });
            }
        }

        req = req.clone({
            headers: req.headers.set(
                'Accept',
                'application/json;charset=utf-8'
            ),
        });

        // return next.handle(req);

        return next.handle(req).pipe(
            tap(
                () => {},
                (err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status !== 401) {
                            return;
                        }
                        this.router.navigate(['home'], {
                            state: { data: 'timeout' },
                        });
                    }
                }
            )
        );
    }
}
