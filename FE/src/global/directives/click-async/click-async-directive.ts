import { Directive, HostListener, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LoggingService } from 'global/services/logging.service';

@Directive({
    selector: '[click-async]'
})
export class ClickAsyncDirective {

    private ongoing: boolean = false;

    @Input('click-async')
    params: { method: Function; args?: any[]; };

    @HostListener('click')
    onClick() {
        if (!this.ongoing && this.params && this.params.method) {
            this.ongoing = true;
            this.loggingService.LOG('INFO', { class: ClickAsyncDirective.name, function: this.onClick.name, text: 'Method "' + this.params.method.name + '" called.' });
            const result = this.params.method(...(this.params.args || []));
            if (result.constructor === Observable) {
                (result as Observable<any>).pipe(finalize(() => this.ongoing = false)).subscribe();
            } else if (result.constructor === Promise) {
                (result as Promise<any>).finally(() => this.ongoing = false)
            } else {
                this.ongoing = false;
            }
        } else if (this.ongoing) {
            this.loggingService.LOG('WARN', { class: ClickAsyncDirective.name, function: this.onClick.name, text: 'Method "' + this.params.method.name + '" blocked. Already called.' });
        } else {
            this.loggingService.LOG('WARN', { class: ClickAsyncDirective.name, function: this.onClick.name, text: 'Missing params found.' });
        }
    }

    constructor(
        private readonly loggingService: LoggingService
    ) { }

    public static getClickAsyncParams<M extends (...args: any[]) => Observable<any> | Promise<any> | any>(method: M, ...args: Parameters<M>): { method: M; args?: Parameters<M>; } {
        return { method, args };
    }

}
