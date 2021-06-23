import { Request, ResponseToolkit, RouteRequestExtType, ServerExtOptions } from '@hapi/hapi';

import { RouteImplementation } from '../implementations/route.implementation';
import { DispatcherService } from '../services/dispatcher.service';

export type ExtensionOptionsType = ServerExtOptions;
export type ExtensionMethodType<R, M = any> = R extends RouteImplementation<infer B, infer P, infer O> ? (dispatcherService: DispatcherService) => (this: M, request: Request, h: ResponseToolkit, err?: Error) => Promise<any> : unknown;
export type ExtensionObjectType<R, M = any> = { method: R extends RouteImplementation ? ExtensionMethodType<R, M> : unknown; options?: ExtensionOptionsType; };
export type ExtensionObjectFactoryType<P> = (params: P) => { method: ExtensionMethodType<RouteImplementation, any>; options?: ExtensionOptionsType; };
export type ExtensionPluginType<P, M = any> = { [KP in keyof P]?: P[KP] extends RouteImplementation ? { [KR in RouteRequestExtType]?: ExtensionObjectType<P[KP], M>[] } : unknown; };
