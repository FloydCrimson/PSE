import { Request, RequestAuth, ResponseToolkit, ServerAuthSchemeObjectApi } from '@hapi/hapi';

import { DispatcherService } from '../services/dispatcher.service';

export type SchemeStrategyType<M> = {
    api?: ServerAuthSchemeObjectApi;
    authenticate: (dispatcherService: DispatcherService) => (this: M, request: Request, h: ResponseToolkit) => Promise<any>;
    payload?: (dispatcherService: DispatcherService) => (this: M, request: Request, h: ResponseToolkit) => Promise<any>;
    response?: (dispatcherService: DispatcherService) => (this: M, request: Request, h: ResponseToolkit) => Promise<any>;
    verify?: (dispatcherService: DispatcherService) => (this: M, auth: RequestAuth) => Promise<void>;
    options?: { payload?: boolean; };
};
