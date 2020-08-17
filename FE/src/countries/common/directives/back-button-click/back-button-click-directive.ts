import { Directive, AfterViewInit, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
    selector: '[back-button-click]'
})
export class BackButtonClickDirective implements AfterViewInit {

    @HostListener('click') onClick(event) {
        this.onBackButtonClickEmitter.emit(event);
    }

    @Output('back-button-click') onBackButtonClickEmitter = new EventEmitter<Event>();

    constructor() { }

    public async ngAfterViewInit(): Promise<void> {
        document.addEventListener('ionBackButton', (event: CustomEvent) => {
            event.detail.register(10, _ => this.onBackButtonClickEmitter.emit(event));
        });
    }

}
