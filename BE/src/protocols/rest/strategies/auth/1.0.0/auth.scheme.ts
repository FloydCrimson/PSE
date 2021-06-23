import { Request, RequestAuth, ResponseToolkit } from '@hapi/hapi';

import { SchemeStrategyType } from '../../../types/scheme.type';
import { AuthMethodImplementation } from '../common/auth.implementation';
import { DispatcherService } from '../../../services/dispatcher.service';

export const AuthScheme: SchemeStrategyType<AuthMethodImplementation> = {
    api: {},
    authenticate: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit): Promise<any> {
        request.log('AuthStrategy.authenticate', request); return h.continue;
    },
    payload: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit): Promise<any> {
        request.log('AuthStrategy.payload', request); return h.continue;
    },
    response: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit): Promise<any> {
        request.log('AuthStrategy.response', request); return h.continue;
    },
    verify: (dispatcherService: DispatcherService) => async function (auth: RequestAuth): Promise<void> {

    },
    options: { payload: true }
};
