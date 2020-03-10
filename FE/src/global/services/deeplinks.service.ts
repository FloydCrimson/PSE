import { Injectable } from '@angular/core';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';

import { Subscription } from 'rxjs';
import { DeeplinksRepository, DeeplinksImplementation } from 'global/repositories/deeplinks.repository';
import { CoderProvider } from 'global/providers/coder.provider';

@Injectable({
    providedIn: 'root'
})
export class DeeplinksService {

    private subscription: Subscription;

    constructor(
        private readonly deeplinks: Deeplinks,
        private readonly deeplinksRepository: DeeplinksRepository
    ) { }

    public subscribe(): void {
        if (!this.subscription || this.subscription.closed) {
            this.subscription = this.deeplinks.route(this.deeplinksRepository.getPaths()).subscribe(match => {
                try {
                    const handler: DeeplinksImplementation<any> = match.$route;
                    const params = JSON.parse(CoderProvider.decode(match.$args.params));
                    handler(match.$link, params);
                } catch (error) {
                    console.error('DeeplinksService', match, error);
                }
            }, unmatch => {
                console.warn('DeeplinksService', unmatch);
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
