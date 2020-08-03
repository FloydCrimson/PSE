import { NextFunction } from 'express';

import { DispatcherService } from '../services/dispatcher.service';
import { RequestImplementation } from './request.implementation';
import { ControllerServiceImplementation } from '../services/controller.service';

export interface RouteImplementation<P> {
    operation: string;
    middlewares?: ((dispatcherService: DispatcherService) => (request: RequestImplementation, next: NextFunction) => Promise<any>)[];
    handler?: { controller: keyof ControllerServiceImplementation; action: string; };
}
