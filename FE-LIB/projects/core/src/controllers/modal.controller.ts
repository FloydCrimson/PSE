import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalOptions, ComponentRef } from '@ionic/core';

@Injectable()
export class PSEModalController {

    constructor(
        private readonly modalController: ModalController
    ) { }

    public async create<I extends IInput, O extends IOutput>(modal: PSEModal<I, O>, params?: IParams<I>, options?: IOptions<I>) {
        const component = await modal.component();
        const optionsG: ModalOptionsG<I> = { animated: true, ...options, component, componentProps: params?.input, id: modal.id };
        return (await this.modalController.create(optionsG)) as HTMLIonModalElementG<I, O>;
    }

    public dismiss<I extends IInput, O extends IOutput>(modal: PSEModal<I, O>, results?: IResults<O>, role?: string) {
        return this.modalController.dismiss(results?.output, role, modal.id);
    }

    public async getTop<I extends IInput, O extends IOutput>() {
        return (await this.modalController.getTop()) as HTMLIonModalElementG<I, O>;
    }

    //

    public static getParams<I extends IInput, O extends IOutput>(modal: PSEModal<I, O>): IParams<I> {
        return {} as IParams<I>;
    }

    public static getResults<I extends IInput, O extends IOutput>(modal: PSEModal<I, O>): IResults<O> {
        return {} as IResults<O>;
    }

}

export type PSEModal<I extends IInput = undefined, O extends IOutput = undefined> = {
    id: string;
    component: () => Promise<ComponentRef>;
}

interface ModalOptionsG<I extends IInput> extends ModalOptions {
    id: string;
    componentProps?: I;
}

interface HTMLIonModalElementG<I extends IInput, O extends IOutput> extends HTMLIonModalElement {
    componentProps?: I;
    dismiss: (data?: O, role?: string | undefined) => Promise<boolean>;
    onDidDismiss: <T = O>() => Promise<{ data?: T; role?: string; }>;
    onWillDismiss: <T = O>() => Promise<{ data?: T; role?: string; }>;
}

type IParams<I extends IInput> = { input?: I; };
type IResults<O extends IOutput> = { output?: O; };
type IOptions<I extends IInput> = Omit<ModalOptionsG<I>, 'component' | 'componentProps' | 'id'>;

type IInput = { [key: string]: any } | undefined;
type IOutput = any | undefined;
