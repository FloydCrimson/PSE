import { NextFunction } from 'express';
import * as hawk from '@hapi/hawk';

import { MiddlewareImplementation } from '../implementations/middleware.implementation';
import { DispatcherService } from '../../../global/services/dispatcher.service';
import { RequestImplementation } from '../implementations/request.implementation';
import { ResponseImplementation } from '../implementations/response.implementation';

export const AuthMiddleware: MiddlewareImplementation<undefined> = () => {
    return (dispatcherService: DispatcherService) => {
        return async (request: RequestImplementation, response: ResponseImplementation, next: NextFunction) => {
            console.log('AuthMiddleware', request, response);
            next();
        };
    };
}
