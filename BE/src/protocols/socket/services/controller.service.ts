import { FactoryExtension } from '../../../global/common/extensions/factory.extension';
import { DispatcherService } from './dispatcher.service';

import * as CI from '../controllers.index';

export class ControllerService extends FactoryExtension<ControllerServiceImplementation> {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) {
        super();
        this.initialize();
    }

    private initialize(): void {
        for (const controller in CI) {
            super.set(controller as keyof ControllerServiceImplementation, new CI[controller](this.dispatcherService));
        }
    }

}

export interface ControllerServiceImplementation {
    EchoController: CI.EchoController;
}
