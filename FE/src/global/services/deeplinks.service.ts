import { Injectable } from '@angular/core';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Subscription } from 'rxjs';
import { CoderProvider } from 'pse-global-providers';

import { DeeplinksRepository, DeeplinksImplementation } from 'global/repositories/deeplinks.repository';
import { LoggingService } from './logging.service';

@Injectable({
    providedIn: 'root'
})
export class DeeplinksService {

    private subscription: Subscription;

    constructor(
        private readonly deeplinks: Deeplinks,
        private readonly deeplinksRepository: DeeplinksRepository,
        private readonly loggingService: LoggingService
    ) { }

    public subscribe(): void {
        if (!this.subscription || this.subscription.closed) {
            this.subscription = this.deeplinks.route(this.deeplinksRepository.getPaths()).subscribe(match => {
                try {
                    const handler: DeeplinksImplementation<any> = match.$route;
                    const params = JSON.parse(CoderProvider.decode(match.$args.params));
                    handler(match.$link, params);
                } catch (error) {
                    this.loggingService.LOG('ERROR', { class: DeeplinksService.name, function: this.subscribe.name }, match, error);
                }
            }, unmatch => {
                this.loggingService.LOG('WARN', { class: DeeplinksService.name, function: this.subscribe.name }, unmatch);
                this.subscription = undefined;
                this.subscribe();
            });
        }
    }

    public unsubscribe(): void {
        if (this.subscription && !this.subscription.closed) {
            this.subscription.unsubscribe();
        }
    }

}
