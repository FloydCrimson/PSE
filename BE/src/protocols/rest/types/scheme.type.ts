import * as Hapi from '@hapi/hapi';

import { DispatcherService } from '../services/dispatcher.service';

export type SchemeMethodLifecycleType<M = any> = (dispatcherService: DispatcherService) => (this: M, request: Hapi.Request, h: Hapi.ResponseToolkit) => Promise<any>;
export type SchemeMethodVerifyType<M = any> = (dispatcherService: DispatcherService) => (this: M, auth: Hapi.RequestAuth) => Promise<void>;
export type SchemeStrategyType<M = any> = { authenticate: SchemeMethodLifecycleType<M>; payload?: SchemeMethodLifecycleType<M>; response?: SchemeMethodLifecycleType<M>; verify?: SchemeMethodVerifyType<M>; config?: Hapi.ServerAuthSchemeObjectApi; options?: { payload?: boolean; }; };
