import { Request, Response, NextFunction } from '../implementations/express.implementation';
import { MiddlewareImplementation } from '../implementations/middleware.implementation';
import { DispatcherService } from '../services/dispatcher.service';
import { SendProvider } from '../providers/send.provider';

import { RoleType } from '../../database/types/role.type';
import * as EI from '../../database/entities.index';

export const RoleMiddleware: MiddlewareImplementation<{ roles: '*' | RoleType[]; }> = (params) => {
    params = { roles: '*', ...params };
    return (dispatcherService: DispatcherService) => {
        return async (request: Request, response: Response, next: NextFunction) => {
            const auth: EI.AuthEntity = response.locals.hawk.credentials;
            if (params.roles === '*' || params.roles.indexOf(auth.role) >= 0) {
                next();
            } else {
                SendProvider.sendError(request, response, 403, { status: 403, error: 'Unauthorized', message: 'Unauthorized' });
            }
        };
    };
}
