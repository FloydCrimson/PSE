import { Request, Response } from 'express';

import { ControllerExtension } from '../extensions/controller.extension';
import { EchoRoute } from '../routes/echo.route';
import { DispatcherService } from '../../../global/services/dispatcher.service';

export class EchoController extends ControllerExtension {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) {
        super();
    }

    async EchoGET(request: Request, response: Response): Promise<any> {
        let { body, params, output } = super.getArguments(EchoRoute.EchoGET, request);
        output = Object.keys(params).length > 0 ? params : { echo: 'Hello World!' };
        return output;
    }

    async EchoPOST(request: Request, response: Response): Promise<any> {
        let { body, params, output } = super.getArguments(EchoRoute.EchoPOST, request);
        output = Object.keys(body).length > 0 ? body : { echo: 'Hello World!' };
        return output;
    }

    async EchoAuthGET(request: Request, response: Response): Promise<any> {
        let { body, params, output } = super.getArguments(EchoRoute.EchoAuthGET, request);
        output = Object.keys(params).length > 0 ? params : { echo: 'Hello A-World!' };
        return output;
    }

    async EchoAuthPOST(request: Request, response: Response): Promise<any> {
        let { body, params, output } = super.getArguments(EchoRoute.EchoAuthPOST, request);
        output = Object.keys(body).length > 0 ? body : { echo: 'Hello A-World!' };
        return output;
    }

}
