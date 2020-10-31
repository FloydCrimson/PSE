import { Request, Response } from 'express';

import { ControllerExtension } from '../extensions/controller.extension';
import { DispatcherService } from '../services/dispatcher.service';
import { EchoRoute, EchoRouteImplementation } from '../routes/echo.route';
import { ControllerMethodType } from '../types/controller-method.type';

export class EchoController extends ControllerExtension implements EchoControllerImplementation {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) {
        super();
    }

    public async EchoGET(request: Request, response: Response) {
        return super.wrapper(EchoRoute.EchoGET, request, response, async (body, params, output) => {
            output = Object.keys(params).length > 0 ? params : { echo: 'Hello World!' };
            return output;
        });
    }

    public async EchoPOST(request: Request, response: Response) {
        return super.wrapper(EchoRoute.EchoPOST, request, response, async (body, params, output) => {
            output = Object.keys(body).length > 0 ? body : { echo: 'Hello World!' };
            return output;
        });
    }

    public async EchoAuthGET(request: Request, response: Response) {
        return super.wrapper(EchoRoute.EchoAuthGET, request, response, async (body, params, output) => {
            output = Object.keys(params).length > 0 ? params : { echo: 'Hello A-World!' };
            return output;
        });
    }

    public async EchoAuthPOST(request: Request, response: Response) {
        return super.wrapper(EchoRoute.EchoAuthPOST, request, response, async (body, params, output) => {
            output = Object.keys(body).length > 0 ? body : { echo: 'Hello A-World!' };
            return output;
        });
    }

}

interface EchoControllerImplementation {
    EchoGET: ControllerMethodType<EchoRouteImplementation['EchoGET']>;
    EchoPOST: ControllerMethodType<EchoRouteImplementation['EchoPOST']>;
    EchoAuthGET: ControllerMethodType<EchoRouteImplementation['EchoAuthGET']>;
    EchoAuthPOST: ControllerMethodType<EchoRouteImplementation['EchoAuthPOST']>;
}
