import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LoadingOptions } from '@ionic/core';

import { LoadingImplementation } from 'global/common/implementations/loading.implementation';

import { LoggingService } from './logging.service';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    private stack = new Array<['present' | 'dismiss', { loading: LoadingImplementation, resolve: (value?: boolean) => void, reject: (reason?: any) => void }]>();
    private array = new Array<[string, { loading: LoadingImplementation, element: HTMLIonLoadingElementC, count: number }]>();
    private id: string = null;

    constructor(
        private readonly loadingController: LoadingController,
        private readonly loggingService: LoggingService
    ) { }

    public present(loading: LoadingImplementation): Promise<boolean> {
        this.loggingService.LOG('DEBUG', { class: LoadingService.name, function: this.present.name }, loading);
        return this.add('present', loading);
    }

    public dismiss(loading: LoadingImplementation): Promise<boolean> {
        this.loggingService.LOG('DEBUG', { class: LoadingService.name, function: this.dismiss.name }, loading);
        return this.add('dismiss', loading);
    }

    private add(type: 'present' | 'dismiss', loading: LoadingImplementation): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.stack.push([type, { loading, resolve, reject }]);
            if (this.stack.length === 1) {
                this.next();
            }
        });
    }

    //

    private async next(): Promise<void> {
        if (this.stack.length > 0) {
            const [type, { loading, resolve, reject }] = this.stack[0];
            const index = this.array.findIndex((e) => e[0] === loading.id);
            if (type === 'present') {
                if (index >= 0) {
                    this.array[index][1].count++;
                    const result = await this.push(loading.id);
                    resolve(result);
                } else {
                    this.array.push([loading.id, { loading, element: undefined, count: 1 }]);
                    const result = await this.push(loading.id);
                    resolve(result);
                }
            } else if (type === 'dismiss') {
                if (index >= 0) {
                    this.array[index][1].count--;
                    const result = await this.pop(loading.id);
                    resolve(result);
                } else {
                    resolve(false);
                }
            }
            this.stack.shift();
            this.next();
        }
    }

    private push(id: string): Promise<boolean> {
        if (this.id === null) {
            const index = this.array.findIndex((e) => e[0] === id);
            const [, { loading }] = this.array[index];
            const config: LoadingOptions = { animated: true, ...loading.options, id: loading.id };
            return this.loadingController.create(config).then((element) => {
                this.array[index][1].element = element;
                return element.present().then(_ => {
                    this.loggingService.LOG('DEBUG', { class: LoadingService.name, function: this.push.name }, loading);
                    this.id = loading.id;
                    return true;
                }, _ => false).catch(_ => false);
            }, _ => false).catch(_ => false);
        } else {
            return Promise.resolve(false);
        }
    }

    private pop(id: string): Promise<boolean> {
        const index = this.array.findIndex((e) => e[0] === id);
        const [, { loading, element, count }] = this.array[index];
        if (this.id === id) {
            if (count === 0) {
                return element.dismiss().then((result) => {
                    this.loggingService.LOG('DEBUG', { class: LoadingService.name, function: this.pop.name }, loading);
                    this.array.splice(index, 1);
                    this.id = null;
                    if (this.array.length > 0) {
                        return this.push(this.array[0][0]).then(_ => result);
                    } else {
                        return Promise.resolve(result);
                    }
                }, _ => false).catch(_ => false);
            } else {
                return Promise.resolve(false);
            }
        } else {
            if (count === 0) {
                this.array.splice(index, 1);
            }
            return Promise.resolve(false);
        }
    }

}

interface HTMLIonLoadingElementC extends HTMLIonLoadingElement { }
