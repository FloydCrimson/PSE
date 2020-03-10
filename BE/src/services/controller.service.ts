import { DispatcherService } from './dispatcher.service';
import * as CI from '../controllers.index';

export class ControllerService {

    private controllers: Map<any, any>;

    constructor(
        private readonly dispatcherService: DispatcherService
    ) {
        this.controllers = new Map<any, any>();
        this.set('AuthController', new CI.AuthController(this.dispatcherService));
        this.set('EchoController', new CI.EchoController(this.dispatcherService));
        this.set('TestController', new CI.TestController(this.dispatcherService));
    }

    public set<K extends keyof ControllerServiceImplementation>(type: K, service: ControllerServiceImplementation[K]): void {
        this.controllers.set(type, service);
    }

    public get<K extends keyof ControllerServiceImplementation>(type: K): ControllerServiceImplementation[K] {
        return this.controllers.get(type);
    }

}

export interface ControllerServiceImplementation {
    AuthController: CI.AuthController;
    EchoController: CI.EchoController;
    TestController: CI.TestController;
}
