import { Request, Response, NextFunction } from 'express';

import { MiddlewareImplementation } from '../common/implementations/middleware.implementation';
import { DispatcherService } from '../services/dispatcher.service';

export const SessionMiddleware: MiddlewareImplementation<undefined> = () => {
    return (dispatcherService: DispatcherService) => {
        return async (request: Request, response: Response, next: NextFunction) => {
            next();
        };
    };
}
