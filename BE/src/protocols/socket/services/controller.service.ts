import { FactoryExtension } from '../../../global/common/extensions/factory.extension';
import { DispatcherService } from '../../../global/services/dispatcher.service';
import * as CI from '../controllers.index';

export class ControllerService extends FactoryExtension<ControllerServiceImplementation> {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) {
        super();
        this.initialize();
    }

    private initialize(): void {
        super.set('EchoController', new CI.EchoController(this.dispatcherService));
    }

}

export interface ControllerServiceImplementation {
    EchoController: CI.EchoController;
}
