import { Request, Response } from 'express';

import { ControllerExtension } from '../common/extensions/controller.extension';
import { TestRoute } from '../routes/test.route';
import { DispatcherService } from '../services/dispatcher.service';

export class TestController extends ControllerExtension {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) {
        super();
    }

    async test(request: Request, response: Response): Promise<any> {
        let { body, params, output } = super.getArguments(TestRoute.TestGET, request);
        return output;
    }

}
