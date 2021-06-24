import { Request, RequestAuth, ResponseToolkit } from '@hapi/hapi';

import { SchemeStrategyType } from '../../../types/scheme.type';
import { HawkMethodImplementation } from '../common/hawk.implementation';
import { DispatcherService } from '../../../services/dispatcher.service';

export const HawkScheme: SchemeStrategyType<HawkMethodImplementation> = {
    api: {},
    authenticate: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit): Promise<any> {
        request.log('HawkStrategy.authenticate', request); return h.continue;
    },
    payload: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit): Promise<any> {
        request.log('HawkStrategy.payload', request); return h.continue;
    },
    response: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit): Promise<any> {
        request.log('HawkStrategy.response', request); return h.continue;
    },
    verify: (dispatcherService: DispatcherService) => async function (auth: RequestAuth): Promise<void> {

    },
    options: { payload: true }
};
