import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LoadingOptions } from '@ionic/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { PSEBusyService, PSEPipeService } from '../core.module';

@Injectable()
export class PSELoadingService {

    private readonly psePipeService = PSEPipeService.create();

    private readonly loaders = new Array<[PSELoadingOptions, number]>();

    private element?: HTMLIonLoadingElement;

    constructor(
        private readonly pseBusyService: PSEBusyService,
        private readonly loadingController: LoadingController
    ) { }

    public subscribe(tokens: (string | number)[], options?: LoadingOptions): Subscription {
        const pseOptions = { id: Date.now().toString(), ...options } as PSELoadingOptions;
        return this.pseBusyService.check(tokens).pipe(
            filter((busy, index) => busy || index > 0)
        ).subscribe((busy) => {
            if (busy) {
                this.psePipeService.push(this.presentAction.bind(this), pseOptions);
            } else {
                this.psePipeService.push(this.dismissAction.bind(this), pseOptions);
            }
        });
    }

    public dismissAll(): void {
        this.psePipeService.push(this.dismissAllAction.bind(this));
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
            await this.present();
        }
    }

    private async dismissAction(pseOptions: PSELoadingOptions): Promise<void> {
        const index = this.loaders.findIndex(([_pseOptions]) => _pseOptions.id === pseOptions.id);
        if (index >= 0) {
            if (--this.loaders[index][1] === 0) {
                if (index === 0) {
                    await this.dismiss();
                }
                this.loaders.splice(index, 1);
            }
        } else {
            console.warn('Trying to dismiss a loader not presented.', pseOptions);
        }
        if (!this.element && this.loaders.length > 0) {
            await this.present();
        }
    }

    private async dismissAllAction(): Promise<void> {
        if (this.element) {
            await this.dismiss();
        }
        this.loaders.splice(0);
    }

    private async present(): Promise<void> {
        this.element = await this.loadingController.create(this.loaders[0][0]);
        await this.element.present();
    }

    private async dismiss(): Promise<void> {
        await this.element?.dismiss();
        delete this.element;
    }

}

interface PSELoadingOptions extends LoadingOptions {
    id: string;
}
