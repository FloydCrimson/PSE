import { Request, Response, NextFunction } from 'express';

import { MiddlewareImplementation } from '../common/implementations/middleware.implementation';
import { DispatcherService } from '../services/dispatcher.service';
import { CoderProvider } from '../providers/coder.provider';
import { SendProvider } from '../providers/send.provider';

export const ParamsMiddleware: MiddlewareImplementation<undefined> = () => {
    return (dispatcherService: DispatcherService) => {
        return async (request: Request, response: Response, next: NextFunction) => {
            try {
                request.url = request.path;
                if (!request.body) {
                    request.body = {};
                }
                if (request.query) {
                    request.query.params = request.query.params ? JSON.parse(CoderProvider.decode(request.query.params)) : {};
                } else {
                    request.query = { params: {} };
                }
            } catch (error) {
                return SendProvider.sendError(request, response, 500, error);
            }
            next();
        };
    };
}
