import { Request, Response, NextFunction } from 'express';

import { DispatcherService } from '../services/dispatcher.service';
import { MethodType } from '../types/method.type';
import { ControllerServiceImplementation } from '../services/controller.service';
import { Masks } from '../extensions/controller.extension';

export interface RouteImplementation<B = undefined, P = undefined, O = undefined> {
    endpoint: { method: MethodType; route: string; };
    middlewares?: ((dispatcherService: DispatcherService) => (request: Request, response: Response, next: NextFunction) => Promise<any>)[];
    handler?: { controller: keyof ControllerServiceImplementation; action: string; };
    maskB?: Masks;
    maskP?: Masks;
    maskO?: Masks;
}
