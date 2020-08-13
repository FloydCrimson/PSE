import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalOptions } from '@ionic/core';

import { ModalImplementation } from 'global/common/implementations/modal.implementation';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    private array = new Array<[Function | HTMLElement | string | null, HTMLIonModalElementCustom<any, any>]>();

    constructor(
        private readonly modalController: ModalController
    ) { }

    public present<I = undefined, O = undefined>(modal: ModalImplementation<I, O>, input?: I, options?: Omit<ModalOptions, 'component'>): Promise<HTMLIonModalElementCustom<I, O>> {
        options = { animated: true, ...options, componentProps: input };
        return modal.loadChildren().then((loaded) => {
            return this.modalController.create({ ...options, component: loaded }).then((element: HTMLIonModalElementCustom<I, O>) => {
                this.array.push([loaded, element]);
                return element;
            });
        });
    }

    public dismiss<I = undefined, O = undefined>(modal: ModalImplementation<I, O>, output?: O, role?: string): Promise<boolean> {
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

interface HTMLIonModalElementCustom<I = undefined, O = undefined> extends HTMLIonModalElement {
    "componentProps"?: I;
    "dismiss": (data?: O, role?: string | undefined) => Promise<boolean>;
    "onDidDismiss": <T = O>() => Promise<{ data?: T; role?: string; }>;
    "onWillDismiss": <T = O>() => Promise<{ data?: T; role?: string; }>;
}
