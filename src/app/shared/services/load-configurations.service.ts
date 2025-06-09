import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LoadConfigurationsService {
    // Local url to read the variable as environment
    localUrl: any;

    constructor(private http: HttpClient) {}

    // Load urls from the local json file
    loadConfigService() {
        this.http
            .get('assets/config/globalconfig.json')
            .subscribe((response) => {
                this.localUrl = response;
            });
    }

    // It is provide the urls from the local json
    serviceUrl(variable: string): string {
        return this.localUrl[`${variable}`];
    }
}
