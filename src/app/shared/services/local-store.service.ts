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
}
