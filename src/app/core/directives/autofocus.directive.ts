/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, ElementRef } from '@angular/core';
import { constantFunction } from 'src/app/shared/constants/constantFunction.constant';

@Directive({
    selector: '[appAutofocus]',
})
export class AutofocusDirective {
    constructor(private elementRef: ElementRef) {}
    ngAfterViewInit(): void {
        const tb = this.elementRef.nativeElement;
        const objInstace: any = tb;
        if (!constantFunction.isEmpty(objInstace)) {
            objInstace.instance().focus();
        }
    }
}
