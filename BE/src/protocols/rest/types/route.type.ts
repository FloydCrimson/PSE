import { RouteImplementation } from '../implementations/route.implementation';

export type RouteConfigType<R> = R extends RouteImplementation<infer B, infer P, infer O> ? RouteImplementation<B, P, O> : unknown;
export type RouteType<P> = { [KP in keyof P]: P[KP] extends RouteImplementation ? RouteConfigType<P[KP]> : unknown; };
