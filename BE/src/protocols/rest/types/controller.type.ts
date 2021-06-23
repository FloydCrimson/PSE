import { Request, ResponseToolkit } from '@hapi/hapi';

import { RouteImplementation } from '../implementations/route.implementation';
import { DispatcherService } from '../services/dispatcher.service';

export type ControllerMethodType<R, M = any> = R extends RouteImplementation<infer B, infer P, infer O> ? (dispatcherService: DispatcherService) => (this: M, request: Request, h: ResponseToolkit, err?: Error) => Promise<any> : unknown;
export type ControllerPluginType<P, M = any> = { [KP in keyof P]?: P[KP] extends RouteImplementation ? ControllerMethodType<P[KP], M> : unknown; };
