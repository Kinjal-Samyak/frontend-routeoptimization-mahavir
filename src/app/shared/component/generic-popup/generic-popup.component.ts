import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
} from '@angular/core';

@Component({
    selector: 'app-generic-popup',
    templateUrl: './generic-popup.component.html',
    styleUrls: ['./generic-popup.component.scss'],
})
export class GenericPopupComponent implements OnInit {
    @Input() componentDetails = ''; // decorate the property with @Input()
    @Input() declare filterTemplet: TemplateRef<HTMLElement>;
    @Output() sendEvent = new EventEmitter();
    @Input() infoProvide = '';

    constructor() {}

    ngOnInit(): void {}

    /**
     * apply button press event to send true value
     */
    onSave(value?: string) {
        this.sendEvent.emit({
            event: value ? value : 'true',
        });
    }

    onAddNew() {
        this.sendEvent.emit({
            event: 'AddNew',
        });
    }

    onCancel() {
        this.sendEvent.emit({
            event: 'false',
        });
    }

    onNext() {
        this.sendEvent.emit({
            event: 'next',
        });
    }
}
