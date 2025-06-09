import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CommonService } from '../services/common.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    service_count = 0; // initialize the counter.

    constructor(private loaderService: CommonService) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const isProjectStatusRequest = req.url.includes('project_status');

        // Show loader only if the request is NOT "project_status"
        if (!isProjectStatusRequest) {
            this.service_count++; // increment counter
            this.loaderService.show();
        }

        return next.handle(req).pipe(
            finalize(() => {
                if (!isProjectStatusRequest) {
                    this.service_count--; // decrement counter
                    if (this.service_count === 0) {
                        this.loaderService.hide();
                    }
                }
            })
        );
    }
}
