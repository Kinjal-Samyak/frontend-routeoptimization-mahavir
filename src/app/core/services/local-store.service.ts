import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LocalStoreService {
    private ls = window.localStorage;

    constructor() {}

    public setItem(key: string, value: any) {
        value = JSON.stringify(value);
        this.ls.setItem(key, value);
        return true;
    }

    public getItem(key: string) {
        const value = this.ls.getItem(key);
        try {
            if (value != null) {
                return JSON.parse(value);
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }

    public removeItem(key: string) {
        this.ls.removeItem(key);
    }

    public clear() {
        const Logo1 = this.getItem('PrefvalNALogo1');
        const Logo3 = this.getItem('PrefvalNALogo3');
        this.ls.clear();
        if (Logo1) this.setItem('PrefvalNALogo1', Logo1);
        if (Logo3) this.setItem('PrefvalNALogo3', Logo3);
    }
}
