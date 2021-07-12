import * as Hapi from '@hapi/hapi';

import { EchoMethodImplementation } from './echo.implementation';
import { DispatcherService } from '../../../services/dispatcher.service';

export class EchoMethod implements EchoMethodImplementation {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) { }

    public Log(request: Hapi.Request, tags: string | string[], data?: string | object | (() => string | object)): void {
        request.log(tags, data);
    }

};
