import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LoadingOptions } from '@ionic/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { PSEBusyService } from './busy.service';
import { PSEPipeService } from './pipe.service';

@Injectable()
export class PSELoadingService {

    private readonly psePipeService = PSEPipeService.create();

    private readonly loaders = new Array<[PSELoadingOptions, number]>();

    private subscriptions?: Subscription;

    private element?: HTMLIonLoadingElement;

    constructor(
        private readonly pseBusyService: PSEBusyService,
        private readonly loadingController: LoadingController
    ) { }

    public present(options?: LoadingOptions): Promise<void> {
        return this.psePipeService.push(this.presentAction.bind(this), this.getPSELoadingOptions(options));
    }

    public dismiss(options?: LoadingOptions): Promise<void> {
        return this.psePipeService.push(this.dismissAction.bind(this), this.getPSELoadingOptions(options));
    }

    public dismissAll(): Promise<void> {
        return this.psePipeService.push(this.dismissAllAction.bind(this));
    }

    public subscribe(tokens: (string | number)[], options?: LoadingOptions): Subscription {
        const subscription = this.pseBusyService.check(tokens).pipe(
            filter((busy, index) => busy || (index > 0))
        ).subscribe((busy) => busy ? this.present(options) : this.dismiss(options));
        if (!this.subscriptions) {
            this.subscriptions = new Subscription();
        }
        this.subscriptions?.add(subscription);
        return subscription;
    }

    //

    private async presentAction(pseOptions: PSELoadingOptions): Promise<void> {
        const index = this.loaders.findIndex(([_pseOptions]) => _pseOptions.id === pseOptions.id);
        if (index >= 0) {
            ++this.loaders[index][1];
        } else {
            this.loaders.push([pseOptions, 1]);
        }
        if (!this.element) {
            await this.presentElement();
        }
    }

    private async dismissAction(pseOptions: PSELoadingOptions): Promise<void> {
        const index = this.loaders.findIndex(([_pseOptions]) => _pseOptions.id === pseOptions.id);
        if (index >= 0) {
            if (--this.loaders[index][1] === 0) {
                if (index === 0) {
                    await this.dismissElement();
                }
                this.loaders.splice(index, 1);
            }
        } else {
            console.warn('Trying to dismiss a loader not presented.', pseOptions);
        }
        if (!this.element && this.loaders.length > 0) {
            await this.presentElement();
        }
    }

    private async dismissAllAction(): Promise<void> {
        if (this.element) {
            await this.dismissElement();
        }
        this.loaders.splice(0);
        this.subscriptions?.unsubscribe();
        delete this.subscriptions;
    }

    private async presentElement(): Promise<void> {
        this.element = await this.loadingController.create(this.loaders[0][0]);
        await this.element.present();
    }

    private async dismissElement(): Promise<void> {
        await this.element?.dismiss();
        delete this.element;
    }

    private getPSELoadingOptions(options?: LoadingOptions): PSELoadingOptions {
        const id = options?.id || Date.now().toString();
        return { ...options, id } as PSELoadingOptions;
    }

}

interface PSELoadingOptions extends LoadingOptions {
    id: string;
}
