import { Request, Response } from 'express';

import { ControllerExtension } from '../common/extensions/controller.extension';
import { TestRouteImplementation, TestRoute } from '../routes/test.route';
import { DispatcherService } from '../services/dispatcher.service';

export class TestController extends ControllerExtension<TestRouteImplementation> {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) {
        super();
    }

    async test(request: Request, response: Response): Promise<any> {
        let { body, params, output } = super.getArguments('TestGET', TestRoute.TestGET, request);
        return output;
    }

}
