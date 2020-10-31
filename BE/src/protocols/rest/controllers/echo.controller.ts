import { DispatcherService } from '../services/dispatcher.service';
import { EchoRouteImplementation } from '../routes/echo.route';
import { ControllerMethodType } from '../types/controller-method.type';

export class EchoController implements EchoControllerImplementation {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) { }

    public async EchoGET(body: undefined, params: any, output: any): Promise<any> {
        output = Object.keys(params).length > 0 ? params : { echo: 'Hello World!' };
        return output;
    }

    public async EchoPOST(body: any, params: undefined, output: any): Promise<any> {
        output = Object.keys(body).length > 0 ? body : { echo: 'Hello World!' };
        return output;
    }

    public async EchoAuthGET(body: undefined, params: any, output: any): Promise<any> {
        output = Object.keys(params).length > 0 ? params : { echo: 'Hello A-World!' };
        return output;
    }

    public async EchoAuthPOST(body: any, params: undefined, output: any): Promise<any> {
        output = Object.keys(body).length > 0 ? body : { echo: 'Hello A-World!' };
        return output;
    }

}

interface EchoControllerImplementation {
    EchoGET: ControllerMethodType<EchoRouteImplementation['EchoGET']>;
    EchoPOST: ControllerMethodType<EchoRouteImplementation['EchoPOST']>;
    EchoAuthGET: ControllerMethodType<EchoRouteImplementation['EchoAuthGET']>;
    EchoAuthPOST: ControllerMethodType<EchoRouteImplementation['EchoAuthPOST']>;
}
