import { Request, Response } from 'express';

import { ControllerExtension } from '../common/extensions/controller.extension';
import { EchoRouteImplementation, EchoRoute } from '../routes/echo.route';
import { DispatcherService } from '../services/dispatcher.service';

export class EchoController extends ControllerExtension<EchoRouteImplementation> {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) {
        super();
    }

    async echo(request: Request, response: Response): Promise<any> {
        let { body, params, output } = super.getArguments('EchoGET', EchoRoute.EchoGET, request);
        output = Object.keys(params).length > 0 ? params : { echo: 'Hello World!' };
        return output;
    }

}
