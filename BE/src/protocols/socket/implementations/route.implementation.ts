import { NextFunction } from 'express';

import { DispatcherService } from '../../../global/services/dispatcher.service';
import { RequestImplementation } from './request.implementation';
import { ResponseImplementation } from './response.implementation';
import { ControllerServiceImplementation } from '../services/controller.service';

export interface RouteImplementation<I, O> {
    endpoint: { route: string; };
    middlewares?: ((dispatcherService: DispatcherService) => (request: RequestImplementation, response: ResponseImplementation, next: NextFunction) => Promise<any>)[];
    handler?: { controller: keyof ControllerServiceImplementation; action: string; };
}
