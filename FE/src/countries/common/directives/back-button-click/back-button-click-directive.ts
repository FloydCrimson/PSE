import { Directive, AfterViewInit, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';

@Directive({
    selector: '[back-button-click]'
})
export class BackButtonClickDirective implements AfterViewInit, OnDestroy {

    @HostListener('click') onClick(event) {
        this.onBackButtonClickEmitter.emit(event);
    }

    @Output('back-button-click') onBackButtonClickEmitter = new EventEmitter<Event>();

    constructor() { }

    private readonly ionBackButtonEventDelegate = (event: CustomEvent) => {
        event.detail.register(10, _ => this.onBackButtonClickEmitter.emit(event));
    };

    public ngAfterViewInit(): void {
        document.addEventListener('ionBackButton', this.ionBackButtonEventDelegate);
    }

    public ngOnDestroy(): void {
        document.removeEventListener('ionBackButton', this.ionBackButtonEventDelegate);
    }

}
