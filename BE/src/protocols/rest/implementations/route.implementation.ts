import { Request, Response, NextFunction } from 'express';

import { DispatcherService } from '../../../global/services/dispatcher.service';
import { MethodType } from '../types/method.type';
import { ControllerServiceImplementation } from '../services/controller.service';

export interface RouteImplementation<B, P, O> {
    endpoint: { method: MethodType; route: string; };
    middlewares?: ((dispatcherService: DispatcherService) => (request: Request, response: Response, next: NextFunction) => Promise<any>)[];
    handler?: { controller: keyof ControllerServiceImplementation; action: string; };
}
