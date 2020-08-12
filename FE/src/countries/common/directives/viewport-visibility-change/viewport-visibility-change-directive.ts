import { Directive, Output, EventEmitter, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Directive({
    selector: '[viewport-visibility-change]',
    providers: [{ provide: IonContent, useExisting: IonContent }]
})
export class ViewportVisibilityChangeDirective implements AfterViewInit {

    @Output('viewport-visibility-change') onViewportVisibilityChangeEmitter = new EventEmitter<{ visible: boolean; }>();

    private visible: boolean;

    constructor(
        private readonly elementRef: ElementRef<HTMLElement>
    ) { }

    public async ngAfterViewInit(): Promise<void> {
        const content = this.getAncestorByTagName(this.elementRef.nativeElement, 'ION-CONTENT');
        const item = this.getAncestorByTagName(this.elementRef.nativeElement, 'ION-ITEM');
        if (content && item) {
            const scroll = await (content as HTMLIonContentElement).getScrollElement();
            scroll.addEventListener('scroll', _ => {
                if (this.visible !== this.isVisible(scroll, item)) {
                    this.onViewportVisibilityChangeEmitter.emit({ visible: this.visible = !this.visible });
                }
            }, { passive: true });
            this.onViewportVisibilityChangeEmitter.emit({ visible: this.visible = this.isVisible(scroll, item) });
        }
    }

    private getAncestorByTagName(element: HTMLElement, tagName: string): HTMLElement {
        let parentElement = element.parentElement;
        while (parentElement) {
            if (parentElement.tagName === tagName) {
                return parentElement;
            } else {
                parentElement = parentElement.parentElement;
            }
        }
        return null;
    }

    private isVisible(scroll: HTMLElement, element: HTMLElement): boolean {
        const scrollTop = scroll.scrollTop + scroll.offsetTop;
        const scrollBottom = scroll.scrollTop + scroll.offsetTop + scroll.clientHeight;
        const elementTop = element.offsetTop;
        const elementBottom = element.offsetTop + element.clientHeight;
        return !(elementBottom < scrollTop || elementTop > scrollBottom);
    }

}
