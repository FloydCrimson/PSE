import * as Hapi from '@hapi/hapi';

import { RouteImplementation } from '../implementations/route.implementation';
import { DispatcherService } from '../services/dispatcher.service';

export type ExtensionOptionsType = Hapi.ServerExtOptions;
export type ExtensionMethodType<R, M = any> = R extends RouteImplementation<infer B, infer P, infer O> ? (dispatcherService: DispatcherService) => (this: M, request: Hapi.Request, h: Hapi.ResponseToolkit, err?: Error) => Promise<any> : unknown;
export type ExtensionObjectType<R, M = any> = { method: R extends RouteImplementation ? ExtensionMethodType<R, M> : unknown; options?: ExtensionOptionsType; };
export type ExtensionObjectFactoryType<P> = (params: P) => ExtensionObjectType<RouteImplementation, any>;
export type ExtensionPluginType<P, M = any> = { [KP in keyof P]?: P[KP] extends RouteImplementation ? { [KR in Hapi.RouteRequestExtType]?: ExtensionObjectType<P[KP], M>[] } : unknown; };
