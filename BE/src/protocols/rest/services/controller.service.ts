import { FactoryExtension } from '../../common/extensions/factory.extension';
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
        super.set('TestController', new CI.TestController(this.dispatcherService));
    }

}

export interface ControllerServiceImplementation {
    AuthController: CI.AuthController;
    EchoController: CI.EchoController;
    TestController: CI.TestController;
}
