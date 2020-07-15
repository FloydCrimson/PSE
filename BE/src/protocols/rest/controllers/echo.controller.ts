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

    async echo(request: Request, response: Response): Promise<any> {
        let { body, params, output } = super.getArguments(EchoRoute.EchoGET, request);
        output = Object.keys(params).length > 0 ? params : { echo: 'Hello World!' };
        return output;
    }

}
