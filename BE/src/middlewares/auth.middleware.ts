import { Request, Response, NextFunction } from 'express';
import * as hawk from '@hapi/hawk';

import { MiddlewareImplementation } from '../common/implementations/middleware.implementation';
import { DispatcherService } from '../services/dispatcher.service';
import { NonceProvider } from '../providers/nonce.provider';
import { SendProvider } from '../providers/send.provider';

export const AuthMiddleware: MiddlewareImplementation<undefined> = () => {
    return (dispatcherService: DispatcherService) => {
        return async (request: Request, response: Response, next: NextFunction) => {
            try {
                const credentialsFunc = (id) => dispatcherService.get('RepositoryService').get('HawkEntity').findOne({ id }, { relations: ['user'] });
                const options = { payload: JSON.stringify(request.body), nonceFunc: NonceProvider.check };
                const output = await hawk.server.authenticate(request, credentialsFunc, options);
                response.locals.hawk = output;
            } catch (error) {
                for (const header in error.output.headers) {
                    response.setHeader(header, error.output.headers[header]);
                    if (response.hasHeader('Access-Control-Expose-Headers')) {
                        response.setHeader('Access-Control-Expose-Headers', response.getHeader('Access-Control-Expose-Headers') + ', ' + header);
                    } else {
                        response.setHeader('Access-Control-Expose-Headers', header);
                    }
                }
                return SendProvider.sendError(request, response, error.output.statusCode, error.output.payload);
            }
            next();
        };
    };
}
