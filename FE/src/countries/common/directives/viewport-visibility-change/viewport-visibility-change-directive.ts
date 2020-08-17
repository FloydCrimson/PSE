import { Directive, Output, EventEmitter, ElementRef, AfterViewInit, Input } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Directive({
    selector: '[viewport-visibility-change]',
    providers: [{ provide: IonContent, useExisting: IonContent }]
})
export class ViewportVisibilityChangeDirective implements AfterViewInit {

    @Input('unsubscribe-when-visible') unsubscribeWhenVisible = false;

    @Output('viewport-visibility-change') onViewportVisibilityChangeEmitter = new EventEmitter<{ visible: boolean; }>();

    private content: HTMLElement;
    private item: HTMLElement;
    private scroll: HTMLElement;
    private visible: boolean;
    private id;

    constructor(
        private readonly elementRef: ElementRef<HTMLElement>
    ) { }

    public async ngAfterViewInit(): Promise<void> {
        this.content = this.getAncestorByTagName(this.elementRef.nativeElement, 'ION-CONTENT');
        this.item = this.getAncestorByTagName(this.elementRef.nativeElement, 'ION-ITEM');
        if (this.content && this.item) {
            this.scroll = await (this.content as HTMLIonContentElement).getScrollElement();
            this.id = setInterval(() => {
                if (this.item.clientHeight > 48) {
                    this.onViewportVisibilityChangeEmitter.emit({ visible: this.visible = this.isVisible(this.scroll, this.item) });
                    if (!this.visible || !this.unsubscribeWhenVisible) {
                        this.scroll.addEventListener('scroll', this.onScrollDelegate, { passive: true });
                    }
                    clearInterval(this.id);
                }
            }, 50);
        }
    }

    private onScrollDelegate: (event: Event) => any = () => this.onScroll();
    private onScroll(): void {
        if (this.visible !== this.isVisible(this.scroll, this.item)) {
            this.onViewportVisibilityChangeEmitter.emit({ visible: this.visible = !this.visible });
        }
        if (this.visible && this.unsubscribeWhenVisible) {
            this.scroll.removeEventListener('scroll', this.onScrollDelegate)
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
