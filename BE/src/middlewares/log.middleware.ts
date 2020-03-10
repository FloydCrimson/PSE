import { Request, Response, NextFunction } from 'express';

import { MiddlewareImplementation } from '../common/implementations/middleware.implementation';
import { DispatcherService } from '../services/dispatcher.service';

export const LogMiddleware: MiddlewareImplementation<{ verbose: boolean }> = (params = { verbose: false }) => {
    return (dispatcherService: DispatcherService) => {
        return async (request: Request, response: Response, next: NextFunction) => {
            console.log(`Request:   ${request.method} ${request.protocol} ${request.host} ${request.url}`);
            next();
        };
    };
}
