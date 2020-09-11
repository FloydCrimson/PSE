import { NextFunction } from 'express';
import * as hawk from '@hapi/hawk';

import { MiddlewareImplementation } from '../implementations/middleware.implementation';
import { RequestImplementation } from '../implementations/request.implementation';
import { DispatcherService } from '../services/dispatcher.service';
import { CoderProvider } from '../../../global/providers/coder.provider';
import { NonceProvider } from '../../../global/providers/nonce.provider';

export const AuthMiddleware: MiddlewareImplementation<undefined> = () => {
    return (dispatcherService: DispatcherService) => {
        return async (request: RequestImplementation, next: NextFunction) => {
            try {
                const credentialsFunc = (encoded) => {
                    const decoded = JSON.parse(CoderProvider.decode(encoded));
                    if ('id' in decoded || 'email' in decoded || 'nickname' in decoded) {
                        return dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityFindOne', decoded, { relations: ['user'] });
                    }
                    return undefined;
                };
                const options = { payload: JSON.stringify(request.message.params), nonceFunc: NonceProvider.check };
                const method = request.request.method || '';
                const url = request.message.operation;
                const headers = { ...request.request.headers, 'authorization': request.message.auth, 'content-type': 'application/json' };
                const output = await hawk.server.authenticate({ method, url, headers }, credentialsFunc, options);
                request.locals.hawk = output;
                next();
            } catch (error) {
                console.error('AuthMiddleware', error);
                return;
            }
        };
    };
}
