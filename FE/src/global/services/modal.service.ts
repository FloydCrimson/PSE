import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalOptions } from '@ionic/core';

import { ModalImplementation } from 'global/common/implementations/modal.implementation';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    private array = new Array<[Function | HTMLElement | string | null, HTMLIonModalElementGenerics<any, any>]>();

    constructor(
        private readonly modalController: ModalController
    ) { }

    public present<I, O>(modal: ModalImplementation<I, O>, input?: I, options?: Omit<ModalOptions, 'component' | 'componentProps'>): Promise<HTMLIonModalElementGenerics<I, O>> {
        return modal.loadChildren().then((loaded) => {
            const config: ModalOptions = { animated: true, ...options, component: loaded, componentProps: input };
            return this.modalController.create(config).then((element: HTMLIonModalElementGenerics<I, O>) => {
                this.array.push([loaded, element]);
                return element;
            });
        });
    }

    public dismiss<I, O>(modal: ModalImplementation<I, O>, output?: O, role?: string): Promise<boolean> {
        return modal.loadChildren().then((loaded) => {
            for (let i = this.array.length - 1; i >= 0; i--) {
                const [component, element] = this.array[i];
                if (component === loaded) {
                    this.array.splice(i, 1);
                    return element.dismiss(output, role);
                }
            }
            return Promise.reject(new Error('Modal component not found.'));
        });
    }

}

interface HTMLIonModalElementGenerics<I, O> extends HTMLIonModalElement {
    'componentProps'?: I;
    'dismiss': (data?: O, role?: string | undefined) => Promise<boolean>;
    'onDidDismiss': <T = O>() => Promise<{ data?: T; role?: string; }>;
    'onWillDismiss': <T = O>() => Promise<{ data?: T; role?: string; }>;
}
