import { NextFunction } from 'express';

import { MiddlewareImplementation } from '../implementations/middleware.implementation';
import { DispatcherService } from '../../../global/services/dispatcher.service';
import { RequestImplementation } from '../implementations/request.implementation';

export const ParamsMiddleware: MiddlewareImplementation<undefined> = () => {
    return (dispatcherService: DispatcherService) => {
        return async (request: RequestImplementation, next: NextFunction) => {
            console.log('ParamsMiddleware', request);
            next();
        };
    };
}
