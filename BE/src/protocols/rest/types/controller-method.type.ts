import { RouteImplementation } from "../implementations/route.implementation";

export type ControllerMethodType<M extends RouteImplementation> = M extends RouteImplementation<infer B, infer P, infer O> ? (body: B, params: P, output: O) => Promise<O> : unknown;
