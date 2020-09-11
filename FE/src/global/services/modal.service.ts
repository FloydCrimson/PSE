import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalOptions } from '@ionic/core';

import { ModalImplementation } from 'global/common/implementations/modal.implementation';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    constructor(
        private readonly modalController: ModalController
    ) { }

    public create<I, O>(modal: ModalImplementation<I, O>, input?: I, options?: Omit<ModalOptionsG<I, O>, 'component' | 'componentProps'>): Promise<HTMLIonModalElementG<I, O>> {
        const config: ModalOptionsG<I, O> = { animated: true, ...options, component: modal.component, componentProps: input };
        return (this.modalController as ModalControllerG<I, O>).create(config);
    }

    public dismiss<I, O>(modal: ModalImplementation<I, O>, output?: O, role?: string, id?: string): Promise<boolean> {
        return (this.modalController as ModalControllerG<I, O>).dismiss(output, role, id);
    }

    public getTop<I, O>(): Promise<HTMLIonModalElementG<any, any>> {
        return (this.modalController as ModalControllerG<I, O>).getTop();
    }

}

interface ModalOptionsG<I, O> extends ModalOptions {
    componentProps?: I;
}

interface HTMLIonModalElementG<I, O> extends HTMLIonModalElement {
    componentProps?: I;
    dismiss: (data?: O, role?: string | undefined) => Promise<boolean>;
    onDidDismiss: <T = O>() => Promise<{ data?: T; role?: string; }>;
    onWillDismiss: <T = O>() => Promise<{ data?: T; role?: string; }>;
}

interface ModalControllerG<I, O> extends ModalController {
    create(opts: ModalOptionsG<I, O>): Promise<HTMLIonModalElementG<I, O>>;
    dismiss(data?: O, role?: string, id?: string): Promise<boolean>;
    getTop(): Promise<HTMLIonModalElementG<any, any>>;
}
