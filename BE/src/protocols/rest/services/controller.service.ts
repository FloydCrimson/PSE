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
        super.set('AuthController', new CI.AuthController(this.dispatcherService));
        super.set('EchoController', new CI.EchoController(this.dispatcherService));
    }

}

export interface ControllerServiceImplementation {
    AuthController: CI.AuthController;
    EchoController: CI.EchoController;
}
