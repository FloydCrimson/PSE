import { Request, Response, NextFunction } from 'express';

import { ControllerServiceImplementation } from '../services/controller.service';
import { DispatcherService } from '../services/dispatcher.service';
import { MethodType } from '../types/method.type';

export interface RouteImplementation<B, P, O> {
    endpoint: { method: MethodType; route: string; };
    middlewares?: ((dispatcherService: DispatcherService) => (request: Request, response: Response, next: NextFunction) => Promise<any>)[];
    handler?: { controller: keyof ControllerServiceImplementation; action: string; };
}
