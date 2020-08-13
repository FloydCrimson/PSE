import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalOptions } from '@ionic/core';

import { ModalImplementation } from 'global/common/implementations/modal.implementation';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    private array = new Array<[Function | HTMLElement | string | null, HTMLIonModalElement]>();

    constructor(
        private readonly modalController: ModalController
    ) { }

    public present<I = undefined, O = undefined>(modal: ModalImplementation<I, O>, input?: I, options?: Omit<ModalOptions, 'component'>): Promise<O> {
        options = { animated: true, ...options, componentProps: input };
        return modal.loadChildren().then((loaded) => {
            return this.modalController.create({ ...options, component: loaded }).then((element) => {
                this.array.push([loaded, element]);
                return element.present().then(_ => {
                    return element.onDidDismiss().then((value) => value.data);
                });
            });
        });
    }

    public dismiss<I = undefined, O = undefined>(modal: ModalImplementation<I, O>, output?: O): Promise<boolean> {
        return modal.loadChildren().then((loaded) => {
            for (let i = this.array.length - 1; i >= 0; i--) {
                const [component, element] = this.array[i];
                if (component === loaded) {
                    this.array.splice(i, 1);
                    return element.dismiss(output);
                }
            }
            return Promise.reject(new Error('Modal component not found.'));
        });
    }

}
