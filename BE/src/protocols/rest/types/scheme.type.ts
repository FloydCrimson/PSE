import * as Hapi from '@hapi/hapi';

import { DispatcherService } from '../services/dispatcher.service';

export type SchemeStrategyType<M> = {
    authenticate: (dispatcherService: DispatcherService) => (this: M, request: Hapi.Request, h: Hapi.ResponseToolkit) => Promise<any>;
    payload?: (dispatcherService: DispatcherService) => (this: M, request: Hapi.Request, h: Hapi.ResponseToolkit) => Promise<any>;
    response?: (dispatcherService: DispatcherService) => (this: M, request: Hapi.Request, h: Hapi.ResponseToolkit) => Promise<any>;
    verify?: (dispatcherService: DispatcherService) => (this: M, auth: Hapi.RequestAuth) => Promise<void>;
    config?: Hapi.ServerAuthSchemeObjectApi;
    options?: { payload?: boolean; };
};
