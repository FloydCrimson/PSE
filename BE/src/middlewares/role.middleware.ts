import { Request, Response, NextFunction } from 'express';

import { MiddlewareImplementation } from '../common/implementations/middleware.implementation';
import { RoleType } from '../common/types/role.type';
import { DispatcherService } from '../services/dispatcher.service';
import { SendProvider } from '../providers/send.provider';
import * as EI from '../entities.index';

export const RoleMiddleware: MiddlewareImplementation<{ roles: '*' | RoleType[] }> = (params = { roles: '*' }) => {
    return (dispatcherService: DispatcherService) => {
        return async (request: Request, response: Response, next: NextFunction) => {
            const auth: EI.AuthEntity = response.locals.hawk.credentials;
            if (params.roles !== '*' && params.roles.indexOf(auth.role) < 0) {
                return SendProvider.sendError(request, response, 403, { statusCode: 403, error: 'Unauthorized', message: 'Unauthorized' });
            }
            next();
        };
    };
}
